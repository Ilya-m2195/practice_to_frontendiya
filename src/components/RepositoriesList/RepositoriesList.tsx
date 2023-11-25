import style from './repositoriesList.module.css';
import RepositoriesItem from '../RepositoriesItem/RepositoriesItem';
import { FC, useEffect, useState } from 'react';
import PaginationContainer from '../pagination/PaginationContainer';
import { IUserData } from '../../app/App';
import useGetReposData from '../../hooks/useGetReposData';
import Loader from '../Loader/loader';

export interface IReposData {
  name: string;
  description: string;
  id: string;
}

type Props = {
  data: IUserData;
};

enum DefaultValues {
  currentPage = 1,
  pageLimit = 4,
  totalCount = 0
}

const RepositoriesList: FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(DefaultValues.currentPage);
  const [totalCount, setTotalCount] = useState(DefaultValues.totalCount);
  const [repos, isError, isLoading] = useGetReposData(
    data.login,
    currentPage,
    DefaultValues.pageLimit
  );
  const errorMessage = 'User`s repositories was not found.';

  const isReposLength = repos?.length === 0;
  const expressingPaginationValues =
    currentPage * DefaultValues.pageLimit - DefaultValues.pageLimit + 1;

  useEffect(() => {
    if (data.public_repos) {
      setTotalCount(data.public_repos);
    }
  }, [data]);

  return (
    <div>
      {isLoading && <Loader />}
      <h2 className={style.title}>Repositories ({data.public_repos})</h2>
      {(isError || isReposLength) && <h2 className='errorMessage'>{errorMessage}</h2>}
      {repos &&
        repos.map((rep: IReposData) => (
          <RepositoriesItem key={rep.id} name={rep.name} description={rep.description} />
        ))}
      {!isReposLength && (
        <div>
          <div className={style.paginationBlock}>
            <span>
              {expressingPaginationValues} -{' '}
              {expressingPaginationValues !== data.public_repos &&
                `${currentPage * DefaultValues.pageLimit} of `}
              {data.public_repos} items
            </span>
            <PaginationContainer
              totalCount={totalCount}
              currentPage={currentPage}
              pageLimit={DefaultValues.pageLimit}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoriesList;
