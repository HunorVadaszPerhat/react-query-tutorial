import { useState } from "react";
import {useQuery} from 'react-query'

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // 1st paremeter is the name of the query
  // 2nd paremeter is the function that fetches the data -> function must be async
  // staleTime -> time in milliseconds to keep the data from being 'stale' -> out of date. If the data is not stale, it will be refetched.
  // cahce time:
  //  - query goes into cold storage if there is not active useQuery
  //  - cahche data expires after cacheTIme (default: 5 minutes)
  //  - so: how long it is been since the last active useQuery
  //  - after cache expires the data is garbage collected
  //  - cache is backup data to display while fetching data (it is better to dispplay data then no data while fetching nee data)
  const {data, isError, error, isLoading} = useQuery(
      ['posts', currentPage], 
      () => fetchPosts(currentPage),
      /* {
        staleTime: 2000
      } */
  );

  //if(!data) return <div/>

  // isFetching: the async query function has not yet resolved. The fetch is not completed yet
  // is Loading: a sub-set of isFetching. isLoading means that we are in the fetching state. The query function has not resolved yet.
  // There is no cached data -> we have never made this call before. We are fetching and do not have cached data ti display.


  if(isLoading){
    return(
      <h3>Loading...</h3>
    );
  }

  // react query gives 3 tries before it decides that we cannot get the data 
  if(isError){
    return(
      <>
        <h3>Error :(</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button 
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
          }}          
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
