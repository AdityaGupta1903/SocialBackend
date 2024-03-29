const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./db/database');

async function Checkdb() {
  const insertQuery = `INSERT INTO SOCIALUSERS (id,username,password,name,age) 
                         values(19,'AdityaBhai','ADIL','Aditya',20);`
  const insertQuery1 = `INSERT INTO SOCIALUSERS (id,username,password,name,age) 
                         values(20,'AkshatPandey12','ADIL','Akshat',20);`
  await db.query(insertQuery);
  await db.query(insertQuery1);
  //const data = await db.query('SELECT * FROM users');
  //console.log(data.rows);
}


async function start(){
  const insertQuery = `CREATE TABLE SOCIALUSERS(id SERIAL PRIMARY KEY,username VARCHAR(255),password VARCHAR(255),name VARCHAR(255),age INTEGER)`
  await db.query(insertQuery)
 
}

//start();
//Checkdb();

async function search(){
  const query =  `SELECT * FROM SOCIALUSERS`;
  const data = (await db.query(query)).rows;
  console.log(data);
}
search();

const Secretkey = 'AdilBhai';

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const typedef = `
    type User{
        id : ID!
        username : String!
        password : String!
        name : String!
        age : Int!
    }
    type Posts{
        id : ID!
        imageUrl : String!
        description : Boolean
        user : User
    }
    type Query {
        getPosts :[Posts]
        getUser : User
        getUsers : [User]
        login(username:String,password:String) : String!

    }
    type Mutation {
        create (id:String,username:String,Name:String,Age:Int) : User
    }
  `

  const server = new ApolloServer({
    typeDefs: typedef,
    resolvers: {
      Query: {
        getPosts: async (parent, args) => ((await db.query('SELECT * FROM Posts')).rows),
        getUsers: async () => ((await db.query('SELECT * FROM users')).rows),
        getUser: async (parent, { id }) => ((await db.query('SELECT * FROM users')).rows),
        login: async (parent, args) => {
          const username = args.username;
          const password = args.password;
          const token = jwt.sign({ username, password }, Secretkey);
          return token;
        }

      },
      Posts: {
        user: (post) => "Jibbrish"
      },
      Mutation: {
        create : async (parent, args, verify) => {

          await db.query(`INSERT INTO users (id,username,name,age) VALUES(${args.id},'${args.username}','${args.name}',${args.age})`);
        }
      }
    }
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  app.listen(8000, () => console.log("server is running on port 8000"));
}

startServer();

