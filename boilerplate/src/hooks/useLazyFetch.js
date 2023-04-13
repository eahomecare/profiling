import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";

function useLazyFetch(fetchAction) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const handleObserver = useCallback(async(entries) => {
    const [target] = entries;
    console.log(target.isIntersecting);
    if (target.isIntersecting) {
        console.log("INTERSECTING.....");
        setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
  }, [handleObserver]);

  const fetchApi = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      dispatch(fetchAction(page))

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [page,fetchAction,dispatch]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  return { loading, loadMoreRef };
}

export default useLazyFetch;