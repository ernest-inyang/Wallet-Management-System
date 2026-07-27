export interface PaginationOptions {
    page?: number;
    perPage?: number;
}

export function getPagination(options: PaginationOptions) {

    const page = options.page ?? 1;

    const perPage = options.perPage ?? 20;

    const offset = (page - 1) * perPage;

    return {
        page,
        perPage,
        offset,
    };

}