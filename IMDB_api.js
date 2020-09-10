const express=require('express');
const app=express();
var jasonData=require('./web.json')
app.use(express.json())
// app.use(bodyParser.json());
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'chandan19',
      database : 'IMDB'
    }
});
// console.log(jasonData[0]);
app.get('/',(req,res)=>{
    console.log("Database Connected!");
});

app.get('/create',(req,res)=>{
    knex.schema.createTable('imdb_api',(t)=> {
      t.increments('id').primary();
      t.integer('rank',100);
      t.string('title',100);
      t.string('year', 100);
      t.string('rating',(50));
      t.string('url',500);
    }).then(()=>{
      console.log("done!")
    })
})

// post data 
app.post('/insert',(req,res)=>{
    let count = 0
    for (let i of  jasonData){
        count+=1
        knex('imdb_api')
        .insert({
            rank:i["rank"],
            title:i["title"],
            year:i["year"],
            rating:i["rating"],
            url:i["url"]
        })
        .then((rows)=>{})
        .catch((err)=>{
            console.log(err);
        });
    }
    if(count==250){
        res.send(" suceecsfully done ")
    }
})

// get data by position . and if u dont input then it will show all data.
app.get('/get_data',(req,res)=>{
    let rank=req.query.rank || 0;
    knex
    .select('*')
    .from('imdb_api')
    .andWhere(function(){
        if(rank!=0){
            this.where('imdb_api.rank',rank)
        }else{
            this.whereNotNull('imdb_api.rank')
        }
    }).then((rows)=>{
        res.send(rows)
    }).catch((err)=>{
        res.send(err)
    })
})

// put
app.put('/update/:rank',async(req,res)=>{
    let rank=req.params.rank
    await knex('imdb_api')
    .where({"rank":rank})
    .update(req.body)
    .then((row)=>{
        res.send("updated sucessfully")
    }).catch((err)=>{
        res.send(err)
        console.log(err);
    })
})

// delete
app.delete('/delete/:rank',(req,res)=>{
    let rank=req.params.rank
    knex('imdb_api')
    .where({rank:rank})
    .del()
    .then((rows)=>{
        res.send("rows")
    })
    .catch((err)=>{
        res.send(err)
    })
})
app.listen(5000,()=>{console.log('port running 5000');})