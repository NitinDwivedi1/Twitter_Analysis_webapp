from flask import Flask, render_template, request, Response, url_for, redirect, session, jsonify
import io
import json
import random
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import base64

import tweepy as tw
import os
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import seaborn as sns
import nltk
# nltk.download('stopwords')
# nltk.download('punkt')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from wordcloud import WordCloud, STOPWORDS
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from flask_cors import CORS
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root@123'
app.config['MYSQL_DB'] = 'twitter_analysis'
# app.config['MYSQL_DATABASE_CHARSET'] = 'utf-8'
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

mysql = MySQL(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/token', methods=["POST"])
def create_token():
    data = request.get_json()
    print(data)
    email = data['email']
    password = data['password']
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM twitter_analysis.registerdb WHERE emailid = % s AND password = % s',
                   (email, password))
    account = cursor.fetchone()
    if account:
        access_token = create_access_token(identity=email)
        response = {"access_token": access_token}
        return response
    else:
        return {"msg": "Wrong email or password"}


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/register', methods=['GET','POST'])
def register():
    msg = ''
    if request.method == 'POST':
        register_data = request.get_json()
        print(register_data)
        fullname = register_data['fullname']
        emailid = register_data['emailid']
        occupation = register_data['occupation']
        purpose = register_data['purpose']
        password = register_data['password']

        # cur = mysql.connection.cursor()
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        # cursor.execute('SELECT * FROM twitter_analysis.registerdb WHERE emailid = %s', (emailid))
        # account = cursor.fetchone()
        # if account:
        #     msg = 'Account already exists !'
        # elif not re.match(r'[^@]+@[^@]+\.[^@]+', emailid):
        #     msg = 'Invalid email address !'
        # elif not password or not emailid:
        #     msg = 'Please fill out the form !'
        # else:
        cursor.execute("Insert into twitter_analysis.registerdb(fullname,emailid,occupation,purpose,password) values(%s,%s,%s,%s,%s)",(fullname,emailid,occupation,purpose,password))
        mysql.connection.commit()
        msg = 'success'
        cursor.close()
        access_token = create_access_token(identity=emailid)
        response = {"msg":msg, "access_token": access_token}
        return response
    # elif request.method == 'POST':
    #     msg = 'Please fill out the form !'
    #     # cur.close()
    #     return jsonify(msg)


# @app.route('/login', methods =['GET', 'POST'])
# def login():
#     msg = ''
#     if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
#         emailid = request.form['email']
#         password = request.form['password']
#         cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
#         cursor.execute('SELECT * FROM twitter_analysis.registerdb WHERE emailid = % s AND password = % s', (emailid, password ))
#         account = cursor.fetchone()
#         if account:
#             session['loggedin'] = True
#             session['id'] = account['id']
#             session['fullname'] = account['fullname']
#             msg = 'Logged in successfully !'
#             return render_template('index.html', msg = msg)
#         else:
#             msg = 'Incorrect username / password !'
#     return render_template('login.html', msg = msg)



@app.route('/', methods=['POST', 'GET'])
def home(keyword):
    if request.method == 'POST':
    # keyword = 'cricket'
        count = 500
        sentiment_score, sentiment_score_image, wordcloud_image, locs, locations_image, hashtags, hashtags_image, mentioned_users, mentions_image, words, words_image, bigrams, bigrams_image = analyse(keyword, count)
        return sentiment_score, sentiment_score_image, wordcloud_image, locs, locations_image, hashtags, hashtags_image, mentioned_users, mentions_image, words, words_image, bigrams, bigrams_image

@app.route('/plot',methods=['GET','POST'])
def plot():
    data = request.get_json()
    print(data)
    keyword = data['keyword']
    print(keyword)
    sentiment_score, sentiment_score_image, wordcloud_image, locs, locations_image, hashtags, hashtags_image, mentioned_users, mentions_image, words, words_image, bigrams, bigrams_image = home(keyword)
    # if not (sentiment_score & sentiment_score_image & wordcloud_image & locs & locations_image & hashtags & hashtags_image & mentioned_users & mentions_image & words & words_image & bigrams & bigrams_image):
    #     return ({"Error": "Error while fetching! Please try again after some time."})
    sentiment_score = sentiment_score.to_dict()
    locs = locs.to_dict()
    print("locs", locs)
    hashtags = hashtags.set_index('hashtag').T.to_dict('list')
    print("hashtags", hashtags)
    print(mentioned_users)
    mentioned_users = mentioned_users.to_dict()
    print("mentioned_users", mentioned_users)
    words = words.set_index('word').T.to_dict('list')
    print("words", words)
    # bigrams = list(bigrams)
    bigrams_dict = bigrams.to_dict()
    bigrams_dict = dict((str(k), v) for k, v in bigrams_dict.items())
    print("bigrams", bigrams_dict)
    # return ({'keyword': keyword, 'wordcloud_image': image})
    return jsonify({'keyword':keyword, 'sentiment_score':sentiment_score, 'sentiment_score_image':sentiment_score_image, 'wordcloud_image':wordcloud_image, 'locs':locs, 'locations_image':locations_image, 'hashtags':hashtags, 'mentioned_users':mentioned_users, 'hashtags_image':hashtags_image, 'mentions_image':mentions_image, 'words':words, 'words_image':words_image, 'bigrams':bigrams_dict, 'bigrams_image':bigrams_image})


def plot_sentiment_score(sentiment_score, keyword):
    img = io.BytesIO()

    # plt.figure(figsize=(14, 7))
    sentiment_score.plot(kind="bar", x="sentiment", y="count")
    plt.grid(False)
    plt.suptitle('Sentiment score for keyword: '+keyword, fontsize=18)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    # return '<img src="data:image/png;base64,{}">'.format(plot_url)
    return "data:image/png;base64,{}".format(plot_url)


def plot_wordcloud(wordcloud):
    img = io.BytesIO()

    plt.figure(figsize=(10, 8))
    plt.axis('off')
    plt.imshow(wordcloud)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def plot_locations(locs):
    img = io.BytesIO()

    plt.figure(figsize=(14, 7))
    locs.plot(kind='bar', y="count", x="location")
    plt.suptitle('Top locations of tweets')

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def plot_top_hashtags(hashtags, keyword):
    img = io.BytesIO()

    plt.figure(figsize=(14, 7))
    hashtags.plot(kind='bar', y='occurences', x='hashtag')
    plt.grid(False)
    plt.suptitle('Top 10 Hashtags for keyword: '+keyword, fontsize=18)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def plot_top_mentions(top_mentioned_users, keyword):
    img = io.BytesIO()

    top_mentioned_users = top_mentioned_users.to_frame()
    top_mentioned_users.plot(kind='bar')
    plt.grid(False)
    plt.suptitle('Top 10 Users for keyword: '+keyword, fontsize=18)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def plot_most_occuring_words(words, keyword):
    img = io.BytesIO()

    words.plot(kind='bar', y='occurences', x='word')
    plt.grid(False)
    plt.suptitle('Top 10 Words for keyword: '+keyword, fontsize=18)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def plot_most_occuring_bigrams(words, keyword):
    img = io.BytesIO()

    words.plot(kind='bar', y='occurences', x='word')
    plt.grid(False)
    plt.suptitle('Top 10 Bigrams for keyword: '+keyword, fontsize=18)

    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()
    return "data:image/png;base64,{}".format(plot_url)


def analyse(keyword, count):

    consumer_key = 'mGsFf8tqL8sLLmkgvVvE3HPjN'
    consumer_secret = 'q5QSXYDM8nxkJHv8TeSlXkWY2MfLDMEPWkqa8bSFNB6MNhEnmH'
    access_token = '1133675761141862400-Ur7UvngZcvdg5h4WIumm0IS3z31Off'
    access_token_secret = 'lEDEJK96jKvXmOjvY63ZnoMabelGTPxrMtID7xJl8ByB5'
    try:
        auth = tw.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tw.API(auth, wait_on_rate_limit=True)

        # search keyword to fetch tweets
        search_word = keyword + " -filter:retweets"

        # Collecting tweets
        tweets = tw.Cursor(api.search_tweets, q=search_word, lang="en").items(count)

        # for tweet in tweets:
        #     print(tweet)

        # making list of required info(columns)
        twt_list = [[tweet.user.screen_name, tweet.text, tweet.user.followers_count, tweet.created_at, tweet.user.location]
                    for tweet in tweets]
        twt_list

        ### Making Dataframe

        df = pd.DataFrame(data=twt_list, columns=['user', 'tweet', 'followers', 'date', 'location'])
        df

        # df['tweet'] = df['tweet'].astype('string')
        # df['tweet']

        ### Tokenizing words

        # word_tokens = word_tokenize(str(df['tweet']))
        # word_tokens

        additional = ['rt', 'rts', 'retweet']
        # stop_words = set(stopwords.words("english"))
        # NLTK stopwords + our local stopwords
        swords = set().union(stopwords.words('english'), additional)
        len(swords)
        swords

        df['tweet']

        # drop duplicate tweets
        df.drop_duplicates(subset='tweet', inplace=True)

        df.columns

        ### Preprocessing tweets

        df['processed_tweet'] = df['tweet'].str.lower() \
            .str.replace('(@[a-z0-9]+)\w+', ' ') \
            .str.replace('(http\S+)', ' ') \
            .str.replace(' +', ' ') \
            .apply(lambda x: [i for i in x.split() if not i in swords])

        df['processed_tweet']

        ### Stemming

        ps = PorterStemmer()
        df['stemmed'] = df['processed_tweet'].apply(lambda x: [ps.stem(i) for i in x if i != ''])

        df['stemmed']

        df.head(100)

        ### Sentiment Analysis

        import nltk.sentiment.vader as vd
        from nltk import download
        # download('vader_lexicon')

        sia = vd.SentimentIntensityAnalyzer()

        from nltk.tokenize import word_tokenize

        df['sentiment_score'] = df['processed_tweet'].apply(
            lambda x: sum([sia.polarity_scores(i)['compound'] for i in word_tokenize(' '.join(x))]))

        df[['processed_tweet', 'sentiment_score']].head(n=10)

        sentiment_score = df['sentiment_score'].apply(lambda x: round(x, )).value_counts()

        # df['sentiment_score'].apply(lambda x: round(x, )).value_counts().plot(kind="bar", x="sentiment", y="count")
        sentiment_score_image = plot_sentiment_score(sentiment_score, keyword)

        ### User audience category(followers count)

        df['user_audience_category'] = pd.cut(df['followers'], [0, 300, 10000, 999999999], include_lowest=True,
                                              labels=['small', 'medium', 'wide'])

        df['user_audience_category']

        ### Word cloud

        import re
        bigstring = re.sub('[a-z]', ' ', str(df['processed_tweet']))
        bigstring = df['processed_tweet'].apply(lambda x: ' '.join(x)).str.cat(sep=' ')
        bigstring
        # df['processed_tweet']

        wordcloud = WordCloud(stopwords=STOPWORDS,
                              background_color='white',
                              width=400,
                              height=330
                              ).generate_from_text(bigstring)

        # plt.figure(figsize=(10, 8))
        # plt.axis('off')
        # plt.imshow(wordcloud)
        wordcloud_image = plot_wordcloud(wordcloud)

        ## Location of tweets

        locs = df['location'].value_counts()
        locs.drop('', inplace=True)
        locs = locs[locs >= 5]

        locs

        # mapping={"India":"Noida, New Delhi, Mumbai, Kolkata, Ahmedabad, Hyderabad"}

        # df['location']=df['location'].apply(lambda x: mapping[x] if x in mapping.keys() else x)
        # df['location']

        # locs.plot(kind='bar', y="count", x="location")
        # plt.suptitle('Top locations of tweets')
        locations_image = plot_locations(locs)

        ### Top Hashtags

        hashtags = df['tweet'].apply(lambda x: pd.value_counts(re.findall('(#\w+)', x.lower()))) \
            .sum(axis=0) \
            .to_frame() \
            .reset_index() \
            .sort_values(by=0, ascending=False)
        hashtags.columns = ['hashtag', 'occurences']

        hashtags.head(10)

        # plt.figure(figsize=(14, 7))
        # hashtags[:10].plot(kind='bar', y='occurences', x='hashtag')
        # plt.grid(False)
        # plt.suptitle('Top 10 Hashtags for keyword: '+keyword, fontsize=18)
        hashtags_image = plot_top_hashtags(hashtags.head(10), keyword)

        ### Top mentioned users

        top_mentioned_users = df['tweet'].str \
                                  .findall('(@[A-Za-z0-9]+)') \
                                  .apply(lambda x: pd.value_counts(x)) \
                                  .sum(axis=0) \
                                  .sort_values(ascending=False)[:10]
        top_mentioned_users

        # top_mentioned_users.plot(kind='bar')
        # plt.grid(False)
        # plt.suptitle('Top 10 Users for keyword: AGNEEPATH', fontsize=18)
        mentions_image = plot_top_mentions(top_mentioned_users, keyword)

        ### Most occuring words

        words = df['processed_tweet'].dropna() \
            .apply(lambda y: pd.value_counts(re.findall('([\s]\w+[\s])', ' '.join(y)))) \
            .sum(axis=0) \
            .to_frame() \
            .reset_index() \
            .sort_values(by=0, ascending=False)
        words.columns = ['word', 'occurences']

        words.head(10)

        # words[:10].plot(kind='bar', y='occurences', x='word')
        # plt.grid(False)
        # plt.suptitle('Top 10 Words for keyword: AGNEEPATH', fontsize=18)
        most_words_image = plot_most_occuring_words(words[:10], keyword)

        ### Most occuring bigram words

        from nltk import bigrams
        bigramseries = pd.Series([word for sublist in df['processed_tweet'].dropna() \
                                 .apply(lambda x: [i for i in bigrams(x)]) \
                                 .tolist() for word in sublist]) \
            .value_counts()
        bigramseries

        bigramseries.head(10)

        # bigramseries[:10].plot(kind='bar')
        # plt.suptitle('Top 10 Bigrams for keyword: AGNEEPATH', fontsize=18)
        most_bigrams_image = plot_most_occuring_bigrams(bigramseries[:10], keyword)
        return sentiment_score, sentiment_score_image, wordcloud_image, locs, locations_image, hashtags.head(10), hashtags_image, top_mentioned_users ,mentions_image, words.head(10), most_words_image, bigramseries.head(10), most_bigrams_image
    except:
        return (None, None, None, None, None, None, None, None, None, None, None, None, None)

@app.route('/plot')
def plot_png():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')


def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    xs = range(100)
    ys = [random.randint(1, 50) for x in xs]
    axis.plot(xs, ys)
    return fig

