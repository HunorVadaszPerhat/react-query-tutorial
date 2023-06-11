import {useQuery} from 'react-query'


async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  // Why dont comments refresh every time we get new post?
  // - every query uses the same key
  // - data for queries with known keys only refetched upon trigger
  // - example triggers:
  //   - component remounts
  //   - window refocus
  //   - running refetch function
  //   - automated refetc
  //   - query invalidation after a mutation
  // SOLUTION: array as query key
  //  - pass array for the query key not just as a string
  //  - treat the query key as a dependency array
  //  - when key changes create a new query
  //  - query function values should be part of the key
  // https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
  const {data, isError, error, isLoading} = useQuery(
    ['comments', post.id], 
    () => fetchComments(post.id)
  );

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
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
