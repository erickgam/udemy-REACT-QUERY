import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";

import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError)
    return (
      <>
        <div className="error">Oops, something gets wrong: </div>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map(({ results: species }) =>
          species.map(({ name, language, averageLifespan }) => (
            <Species
              key={name}
              name={name}
              language={language}
              averageLifespan={averageLifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
