import {gql} from '@apollo/client';

export const GET_ME=gql`
{
    me{
        _id
        username
        email
        restaurantCount
        savedRestaurants{
            _id
            authors
            description
            restaurantId
            image
            link
            title
        }
    }
}
`;