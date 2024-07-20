const { Sequelize, Model, DataTypes } = require('sequelize');
const {SequlPagination} = require('../index');
const expectedTestModelsCounts = {
    1: 6,
    2: 4,
    3: 0,
    4: 0,
    5: 0
};
describe('Paginator', () => {
    let sequelize;
    let TestModel;
    let RelatedModel;

    beforeAll(async () => {
        sequelize = new Sequelize('sqlite::memory:', { logging: false });

        TestModel = sequelize.define('TestModel', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rel_id: {
                type: DataTypes.INTEGER,
            }
        });
        RelatedModel = sequelize.define('RELModel', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            test: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });
        RelatedModel.hasMany(TestModel, {
            foreignKey: {
                name: 'rel_id',
                field: 'rel_id',
            }
        })
        TestModel.belongsTo(RelatedModel, {
            foreignKey: {
                name: 'rel_id',
                field: 'rel_id',
            }
        })

        await sequelize.sync({ force: true });
        const relData = [
            { id: 1, test: 'Test 1' },
            { id: 2, test: 'Test 2' },
            { id: 3, test: 'Test 3' },
            { id: 4, test: 'Test 4' },
            { id: 5, test: 'Test 5' },
            { id: 6, test: 'Test 6' },
            { id: 7, test: 'Test 7' },
            { id: 8, test: 'Test 8' },
            { id: 9, test: 'Test 9' },
            { id: 10, test: 'Test 10' },
        ];
        await RelatedModel.bulkCreate(relData);
        const dummyData = [
            { id: 1, name: 'Test 1', rel_id: 1 },
            { id: 2, name: 'Test 2', rel_id: 1 },
            { id: 3, name: 'Test 3', rel_id: 1 },
            { id: 4, name: 'Test 4', rel_id: 1 },
            { id: 5, name: 'Test 5', rel_id: 1 },
            { id: 6, name: 'Test 6', rel_id: 1 },
            { id: 7, name: 'Test 7', rel_id: 2 },
            { id: 8, name: 'Test 8', rel_id: 2 },
            { id: 9, name: 'Test 9', rel_id: 2 },
            { id: 10, name: 'Test 10', rel_id: 2 },

        ];
        await TestModel.bulkCreate(dummyData);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('getPagination returns correct limit and offset', () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setPage(2).setSize(5);

        const pagination = paginator.getPagination();
        expect(pagination.limit).toBe(5);
        expect(pagination.offset).toBe(5);
    });

    test('getPagingData returns correct paging data', async () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setPage(1).setSize(5);

        const data = await TestModel.findAndCountAll({
            limit: 5,
            offset: 0,
        });

        const pagingData = paginator.getPagingData(data);

        expect(pagingData.totalItems).toBe(10);
        expect(pagingData.rows.length).toBe(5);
        expect(pagingData.totalPages).toBe(2);
        expect(pagingData.currentPage).toBe(1);
    });

    test('execute returns correct paginated data', async () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setPage(1).setSize(5);

        const result = await paginator.execute();

        expect(result.totalItems).toBe(10);
        expect(result.rows.length).toBe(5);
        expect(result.totalPages).toBe(2);
        expect(result.currentPage).toBe(1);
        expect(result.size).toBe(5);
    });

    test('execute applies conditions correctly', async () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setCondition({ name: 'Test 1' });

        const result = await paginator.execute();

        expect(result.totalItems).toBe(1);
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].name).toBe('Test 1');
    });

    test('execute applies order correctly', async () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setOrderBy([['name', 'DESC']]);

        const result = await paginator.execute();

        expect(result.rows[0].name).toBe('Test 9');
    });
    test('execute applies associations expectedTestModelsCounts', async () => {
        const paginator = new SequlPagination(RelatedModel);
        paginator.setAssociations([{
            model: TestModel,
            aattributes: ['name']
        }]);

        const result = await paginator.execute();
        result.rows.forEach(row => {
            expect(row).toHaveProperty('TestModels');
            expect(row.TestModels.length).toBe(expectedTestModelsCounts[row.id]);
        });
    });

    test('execute applies data transformation function correctly', async () => {
        const paginator = new SequlPagination(TestModel);
        paginator.setDataTransformFn(data => {

            data.rows = data.rows.map(row => ({ ...row.dataValues, transformed: true }));
            return data;
        });

        const result = await paginator.execute();
        expect(result.rows[0]).toHaveProperty('transformed', true);
    });

});
