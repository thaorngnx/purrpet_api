import db from '../models';

export const pagination = ({ data, total, limit, page }) => {
  const _limit = parseInt(limit) || 12;
  const _page = parseInt(page) || 1;
  const totalPage = Math.ceil(total / _limit);
  const dataInOnePage = data.slice((_page - 1) * _limit, _page * _limit);
  return {
    data: dataInOnePage,
    pagination: {
      page: _page,
      limit: _limit,
      total: totalPage,
    },
  };
};

//pagination function: get collection, total, limit, page, query as arguments

export const paginationQuery = async (collection, query, limit, page, sort) => {
  const _limit = parseInt(limit) || 12;
  const _page = parseInt(page) || 1;
  const _sort = sort || { _id: -1 };
  const count = await db[collection].countDocuments(query);
  const totalPage = Math.ceil(count / _limit);
  const data = await db[collection]
    .find(query)
    .limit(_limit)
    .skip((_page - 1) * _limit)
    .sort(_sort);
  return {
    data,
    pagination: {
      page: _page,
      limit: _limit,
      total: totalPage,
    },
  };
};
