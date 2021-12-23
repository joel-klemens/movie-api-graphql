const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()

//test data 
const directors = [
	{ id: 1, name: 'Chris Columbus' },
	{ id: 2, name: 'Peter Jackson' },
	{ id: 3, name: 'Mike Newell' },
    { id: 4, name: 'Alfonso Cuarón' },
]
const movies = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', directorId: 1 },
    { id: 2, name: 'The Fellowship of the Ring', directorId: 2 },
	{ id: 3, name: 'The Two Towers', directorId: 2 },
	{ id: 4, name: 'The Return of the King', directorId: 2 },
	{ id: 5, name: 'Harry Potter and the Goblet of Fire', directorId: 3 },
    { id: 6, name: 'Harry Potter and the Prisoner of Azkaban', directorId: 4 },
]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'This represents a movie.',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLNonNull(GraphQLInt) }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        movies: {
            type: new GraphQLList(MovieType),
            description: 'List of ALL Movies',
            resolve: () => movies
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server is running.'))