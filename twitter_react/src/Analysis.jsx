import React from "react";

const Analysis = (props) => {
  console.log(props);
  return (
    <>
      {props.sentiment_score_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Sentiment
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.sentiment_score_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props.data1?.sentiment_score_image.length > 0 && (
              <img src={props.data1?.sentiment_score_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      {/* <h3>WordCloud</h3> */}

      {props.data1.wordcloud_image.length > 0 && (
        <div class="flex justify-center">
          <div class="rounded-lg shadow-lg bg-white max-w-sm">
            {props.data1?.wordcloud_image.length > 0 && (
              <img src={props.data1?.wordcloud_image} alt="image"></img>
            )}
            <div class="p-6">
              <h5 class="text-gray-900 text-xl font-medium mb-2">WordCloud</h5>
            </div>
          </div>
        </div>
      )}

      <br />
      <br />

      {props.locs_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Occurance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.locs_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props.data1?.locations_image.length > 0 && (
              <img src={props.data1?.locations_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      <br />
      <br />
      {props.hashtags_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Hashtag
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Occurance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.hashtags_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props?.data1.hashtags_image.length > 0 && (
              <img src={props?.data1.hashtags_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      <br />
      <br />
      {props.mentioned_users_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Occurance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.mentioned_users_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props?.data1?.mentions_image.length > 0 && (
              <img src={props?.data1?.mentions_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      <br />
      <br />
      {props.words_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Word
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Occurance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.words_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props?.data1.words_image.length > 0 && (
              <img src={props?.data1.words_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      <br />
      <br />
      {props.bigrams_updated1.length > 0 && (
        <div className="flex justify-between items-center">
          <div class="flex flex-col w-50 h-50">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full border">
                    <thead class="border-b">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Bigram Word
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Occurance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.bigrams_updated1?.map((item) => (
                        <tr class="bg-white border-b">
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[0]}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50 h-50">
            {props?.data1.bigrams_image.length > 0 && (
              <img src={props?.data1.bigrams_image} alt="image"></img>
            )}
          </div>
        </div>
      )}
      <br />
      <br />
    </>
  );
};
export default Analysis;
