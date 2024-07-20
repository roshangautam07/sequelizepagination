class Paginator {
    constructor(model) {
        this.model = model;
        this.page = 1;
        this.size = 5;
        this.orderBy = null;
        this.condition = null;
        this.attributes = null; // Set to null by default
        this.associations = [];
        this.dataTransformFn = null;
    }

    getPagination() {
        const limit = this.size ? +this.size : 5;
        const offset = this.page ? (this.page - 1) * limit : 0;
        return { limit, offset };
    }

    getPagingData(data) {
        const rows = data?.rows?.map(item => item.dataValues);
        const { count: totalItems } = data;
        const currentPage = this.page ? +this.page : 1;
        const totalPages = Math.ceil(totalItems / this.size);
        return { totalItems, rows, totalPages, currentPage };
    }

    setPage(pageNumber) {
        this.page = pageNumber ? pageNumber : this.page;
        return this;
    }

    setSize(pageSize) {
        this.size = pageSize ? pageSize : this.size;
        return this;
    }

    setOrderBy(order) {
        this.orderBy = order;
        return this;
    }

    setCondition(cond) {
        this.condition = cond;
        return this;
    }

    setAttributes(attrs) {
        this.attributes = attrs;
        return this;
    }
    setAssociations(assocs) {
        this.associations = assocs;
        return this;
    }
    setDataTransformFn(transformFn) {
        this.dataTransformFn = transformFn;
        return this;
    }

    async execute() {
        const { limit, offset } = this.getPagination();

        try {
            const data = await this.model.findAndCountAll({
                where: this.condition,
                attributes: this.attributes || { exclude: [] }, // Set default attributes if null
                limit,
                offset,
                order: this.orderBy,
                include: this.associations,
            });

            const transformedData = this.dataTransformFn ? this.dataTransformFn(data) : data;
            const { totalItems, totalPages, currentPage } = this.getPagingData(transformedData);

            return {
                totalItems,
                rows: transformedData?.rows?.map(item => item),
                currentPage,
                totalPages,
                size: this.size,
            };
        } catch (error) {
            console.error("Pagination execution error:", error);
            throw error;
        }
    }
}

module.exports = Paginator;
