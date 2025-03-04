const express = require("express");
const app = express();
app.use(express.json())



app.get("/pokemon/:pokemonName", async (req,res, next) => {
    try{
        // grab the pokemonName from the params
        const {pokemonName} = req.params;

        // If pokemon is not passed in --- you can turn this into a middleware if you really want to
        if(!pokemonName){
            const notFoundError = new Error("Pokemon was not found");
            notFoundError.status = 404;
            throw notFoundError;
        }


        // grab the pokemon
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        console.log(pokemonResponse)
        // If we have good data
        if(pokemonResponse.ok){
            const data = await pokemonResponse.json();
            // return res.json({pokemon: data.sprites.versions["generation-v"]["black-white"].animated["front_default"]});
            return res.send(`
                <div style="display:flex;justify-content:center; height: 250px; align-items:center;">
                    <img src="${data.sprites.versions["generation-v"]["black-white"].animated["front_default"]}"/>
                </div>`);
        } else{
            // Something went wrong with the pokemon api
            const errorMessage = await pokemonResponse.json();
            const pokemonError = new Error(errorMessage.message);
            pokemonError.status = 500;
            throw pokemonError;
        }
    }catch(e){
        next(e);
    }
});


// 404 handler
app.use((req, res, next) => {
    res.status = 404;
    return res.json("Error: Route was not found.");
});

app.use((err, req, res) => {
    res.status = err.status || 500;
    return res.json({
        message: err.message
    })
});

const port = 8000;
app.listen(port, ()=> console.log("Listening on port: ", port));
