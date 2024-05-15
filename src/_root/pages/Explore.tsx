import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import useDebounce from "@/hooks/useDebounce";

import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { Input } from "@/components/ui/input";
import { ThemeContext } from "@/context/ThemeContext";
import CategorySelector from "@/components/shared/CategorySelector";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const themeContextValue = useContext(ThemeContext);
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearch);

  // Add a state for selected category
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.some((item) => item.documents.length > 0);

  const filteredPosts = shouldShowPosts
    ? posts.pages.flatMap((item) => item.documents)
    : searchedPosts?.documents || []; // Use optional chaining to handle possible undefined value

  const displayedPosts =
    selectedCategory === "All"
      ? filteredPosts
      : filteredPosts.filter((post) => post.category === selectedCategory);

  console.log(displayedPosts);

  //Theme customization

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  // Input field
  const bgColorInput = theme === "light" ? "bg-gray-100" : "bg-dark-4";

  // Badge
  //const bgColorBadge = theme === "light" ? "bg-gray-100" : "bg-dark-3";

  //Text Badge
  //const textBadge = theme === "light" ? "text-dark-1" : "text-light-2";

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">
          Rechercher des publications
        </h2>
        <div className={`flex gap-1 px-4 w-full rounded-lg ${bgColorInput}`}>
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Recherche"
            className={`explore-search ${bgColorInput}`}
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Populaire aujourd'hui</h3>

        {/* <div
          className={`flex-center gap-3 rounded-xl px-4 py-2 cursor-pointer ${bgColorBadge}`}
        >
          <p className={`small-medium md:base-medium ${textBadge}`}>All</p>
          <img
            src="/src/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div> */}
        <div className="flex flex-col cursor-pointer py-2">
          <span>Choisir une catégorie</span>
          <CategorySelector
            onSelectedCategory={(category: string) =>
              setSelectedCategory(category)
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : displayedPosts.length > 0 ? (
          <GridPostList posts={displayedPosts} />
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">
            Aucune publication trouvée
          </p>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
