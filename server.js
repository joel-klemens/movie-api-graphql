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
        directorId: { type: GraphQLNonNull(GraphQLInt) },
        director: {
            type: DirectorType,
            resolve: (movie) => {
                return directors.find(director => director.id === movie.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    description: 'This represents a movie director.',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        movies: { 
            type: GraphQLList(MovieType),
            resolve: (director) => {
                return movies.filter(movie => movie.directorId === director.id)
            }
        }
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
        },
        movie: {
            type: MovieType,
            description: 'A single movie',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => movies.find(movie => movie.id === args.id)
        },
        directors: {
            type: new GraphQLList(DirectorType),
            description: 'List of ALL Directors',
            resolve: () => directors
        },
        director: {
            type: DirectorType,
            description: 'A single Director',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => directors.find(director => director.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addMovie: {
            type: MovieType,
            description: 'Add a Movie',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const movie = { id: movies.length + 1, name: args.name, directorId: args.directorId }
                movies.push(movie)
                return movie
            }
        },
        addDirector: {
            type: DirectorType,
            description: 'Add a Director',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const director = { id: directors.length + 1, name: args.name }
                directors.push(director)
                return director
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server is running.'))