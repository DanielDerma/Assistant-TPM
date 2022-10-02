import { useEffect, useState } from 'react';
import { getFeed } from '../services/firebaseFunctions';

const useDataManage = (step, values) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFeed(step, values)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error({ error });
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading };
};

export default useDataManage;
