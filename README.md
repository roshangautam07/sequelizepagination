# ➡️ sequelize-pagination-offset



Simpe sequlize offset pagination.

## Install

With npm:

```bash
npm i sequelize-pagination-offset
```


## How to use?

Create new Object of  `SequlPagination`:

```javascript
const {SequlPagination} = require('sequelize-pagination-offset');


const data = await new SequlPagination(User)
    .setPage(1)
    .setSize(10)
    .setCondition({ status: 'active' })
    .setAttributes(['id', 'email', 'username'])
    .setAssociations([
      {
        model: DeviceInformation,
        attributes: ['id','serial_number'],
      }
    ])
    .setOrderBy([["createdAt", "DESC"]])
    .setDataTransformFn((data)=>{
      data.rows = data.rows.map(row => ({ ...row.dataValues,transformed:true }));
        return data;
    })
    .execute();
```

The pass sequlize model in `SequlPagination` constructor. 

- `setPage`: Methods sets the current page.(required)
- `setSize`: Methods sets the number of rows to be shown in per page.(required)
- `setAttributes`: Methods  sets the name of column we want to fetch.(optional)
- `setAssociations`: Methods accept array of an object, we include any related model.(optional)
- `setOrderBy`: Methods does sorting based on specified column(optional)
- `setDataTransformFn`: Methods helps to perform any transformation that need before `execute` methods.(optional)
- `execute` : Methods execute the query based on previous chained methods.
