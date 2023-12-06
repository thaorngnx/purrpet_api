export const pagination = ({ data, total, limit, page }) => {
  const _limit = parseInt(limit) || 12;
  const _page = parseInt(page) || 1;
  const totalPage = Math.ceil(total / _limit);
  const dataInOnePage = data.slice((_page - 1) * _limit, _page * _limit);
  return {
    totalPage,
    dataInOnePage,
  };
};
