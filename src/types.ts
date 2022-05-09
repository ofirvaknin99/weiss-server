type movieTypes = "movie" | "series" | "episode";
export interface media {
    Title: string,
    Year: string,
    imdbId: string,
    Type: movieTypes,
    Poster: string
}
export interface listOfMedias {
    Search: media[],
    totalResults: number,
    Response: string
}

export interface fullMediaDetails {
    Actors: string,
    Awards: string,
    BoxOffice: string,
    Country: string,
    DVD: string,
    Director: string,
    Genre: string,
    Language: string,
    Metascore: string,
    Plot: string,
    Poster: string,
    Production: string,
    Rated: string,
    Ratings: ratings[],
    Released: string,
    Response: string,
    Runtime: string,
    Title: string,
    Type: string,
    Website: string,
    Writer: string,
    Year: string,
    imdbID: string,
    imdbRating: string,
    imdbVotes: string
}

interface ratings {
    Source: string,
    Value: string
}