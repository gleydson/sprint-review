import { createParser, parseAsInteger, useQueryStates } from 'nuqs';

const pageIndexParser = createParser({
  parse: query => {
    const page = parseAsInteger.parse(query);
    return page === null ? null : page - 1;
  },
  serialize: value => {
    return parseAsInteger.serialize(value + 1);
  },
});

const paginationParsers = {
  pageIndex: pageIndexParser.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};

const paginationUrlKeys = {
  pageIndex: 'page',
  pageSize: 'per_page',
};

export function usePaginationParams() {
  return useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
  });
}
