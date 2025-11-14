import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 compliant DateTime scalar',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return value;
    }
    throw new TypeError(`DateTime cannot serialize value: ${value}`);
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new TypeError(`DateTime cannot parse value: ${value}`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

