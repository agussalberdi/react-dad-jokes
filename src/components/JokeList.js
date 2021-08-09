import React, { useEffect, useState } from 'react'
import axios from 'axios';
import uuid from 'uuid/dist/v4';
import './JokeList.css';
import Joke from './Joke';
import Emoji from '../assets/emoji.png';

export default function JokeList(props) {
    const [jokes, setJokes] = useState(JSON.parse(localStorage.getItem('jokes')) || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getJokes();
    }, []);

    const getJokes = async () => {
        let jokesArr = [];
        try {
            while (jokesArr.length < props.maxJokes) {
                const res = await axios.get(`https://icanhazdadjoke.com`, {
                    headers: { Accept: 'application/json' }
                });
                jokesArr = [...jokesArr, { id: uuid(), text: res.data.joke, votes: 0 }];
            }
            setJokes([...jokes, ...jokesArr]);
            localStorage.setItem('jokes', JSON.stringify(jokes));
            setLoading(false);
        } catch(err) {
            console.log(err);
            setLoading(false);
        }
    }

    const handleVote = (id, delta) => {
        const newArray = jokes.map(joke => {
            if (joke.id === id) {
                joke.votes += delta;
            }
            return joke; 
        });
        setJokes(newArray);
        localStorage.setItem('jokes', JSON.stringify(newArray));    
    }

    const handleRemove = (id) => {
        setJokes(jokes.filter(joke => joke.id !== id));
        localStorage.setItem('jokes', JSON.stringify(jokes));    
    }

    const handleClick = () => {
        setLoading(true);
        getJokes();
    }

    if (loading) {
        return (
            <div className="spinner">
                <i className="far fa-8x fa-laugh fa-spin"></i>
                <h1 className="JokeList-title">Loading</h1>
            </div>
        )
    } else{
        let jokesArray = jokes.sort((a, b) => b.votes - a.votes);
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src={Emoji}></img>
                    <button className="JokeList-getmore" onClick={() => handleClick()}>Fetch Jokes</button>
                </div>
                <div className="JokeList-jokes">
                    {jokesArray.map((joke) => (
                        <Joke
                            key={joke.id}
                            text={joke.text}
                            votes={joke.votes}
                            upvote={() => handleVote(joke.id, 1)}
                            downvote={() => handleVote(joke.id, -1)}
                            remove={() => handleRemove(joke.id)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}
