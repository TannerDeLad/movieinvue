import Card from "./Components/Card.js";
let theApp = {
    data() {
        return {
            movies: [{
                title: "",
                img: "",
                overview: "",
                adult: 0,
                child: 0,
                id: 0,
                toremove: false,
                removechild: false,
                removeadult: false
            }],
            tot_tick: 0,
            cart: []
        }
    },
    // the axios call under mounted because it shall happen automatically on load. it is essentially identical to the in class lab we did under vue except the id is also being assigned and will be used later to check if the movie has been entered into the cart array or not 
    mounted() {
        //key has been removed
        axios("https://api.themoviedb.org/3/movie/upcoming?api_key=&language=en-US&page=1")
            .then(response => {
                console.log(response);
                var newArray = response.data.results.map((obj) => {
                    //const  {title, poster_path, overview} = obj
                    
                    let tmpObj = {
                        title: obj.title,
                        img: "https://image.tmdb.org/t/p/w500/" + obj.poster_path,
                        overview: obj.overview,
                        id: obj.id
                    }
                    return tmpObj
                })
                //console.log(newArray);
                this.movies = newArray.slice(0, 3);
            })
            .catch(error => {
                console.log(error + "API req fail");
            })
    },
    methods: {
        //activates when the button on a card is clicked
        addtocart(movobj) {
            this.tot_tick++;
            //reset
            //create a for loop that checks every item in the array
            //if there is already something in the cart array, do this
            if (this.cart.length > 0) {
                // for every item in the cart array
                this.cart.forEach((cartitem) => {
                    // utilize the boolean includes method that returns true false
                    //console.log(this.cart.includes(cartitem));
                    // if the cart already has the movboj, don't add it
                    if (this.cart.includes(movobj)) {
                        //if the item inside of cart array matches the movobj title then we shouldn't push new
                        //do nothing

                        //console.log("here");
                    }
                    // if it doesn't already have the cart object, add it
                    else if (!this.cart.includes(movobj)) {
                        this.cart.push(movobj);
                        //console.log("here1");
                    }
                })
            }
            // if the cart is empty do this, automatically add the movobj, movobj being a point in the movies array with the associated fields
            else if (this.cart.length == 0) {
                this.cart.push(movobj);
            }
        },
        // the method that is called when the cart buttons are clicked
        cart_click_adult(item, index) {
            // so there are three different potential values of the movie tickets. there is thisadtick/thischtick in the Card component, the cart adult/child properties, and the movies adult/child properties. The cart is the displayed array and the movies is the baseline array, to be passed to the Card as movobj in props. In this method we are decrementing cart at index selected and decreasing the respective ticket
            this.cart[index].adult--;
            // decrease the total ticket variable that keeps track of how many tickets have been 'ordered'
            this.tot_tick--;
            //loop through the whole movies array
            for(let i = 0; i < this.movies.length; i++)
            {
                //if item's (the passed object in the cart array) id matches the id in the movies array then that movie is now equal to the cart array. this will keep the cart and movies arrays in sync with their ticket totals
                if(item.id == this.movies[i].id)
                {
                    this.movies[i].adult = this.cart[index].adult;
                    // toggle this boolean property to true so that the Card component will update the thisadtick in the correct Card component 
                    this.movies[i].removeadult = true;
                    //console.log("movies" + this.movies[i].adult)
                }
            }
            // if block that will remove the movie from the cart if this button decrements it to zero. the adult/child properties are set to null by default and so without this property we would see a lot of NaN
            if(this.cart[index].adult == 0 && this.cart[index].child == 0 || this.cart[index].adult == null && this.cart[index].child == 0 || this.cart[index].adult == 0 && this.cart[index].child == null)
            {
                //console.log("omit");
                this.cart.splice(index,1);
            }
        },
        // as above, so below, except with the child tickets
        cart_click_child(item, index) {
            this.cart[index].child--;
            this.tot_tick--;
            for(let i = 0; i < this.movies.length; i++)
            {
                if(item.id == this.movies[i].id)
                {
                    this.movies[i].child = this.cart[index].child;
                    this.movies[i].removechild = true;
                }
            }
            if(this.cart[index].adult == 0 && this.cart[index].child == 0 || this.cart[index].adult == null && this.cart[index].child == 0 || this.cart[index].adult == 0 && this.cart[index].child == null)
            {
                console.log("omit");
                this.cart.splice(index,1);
            }
        },
        // rmc that will remove the whole row/cart object
        rmc(item, index) {
            //these if blocks needs to happen first before resetting the values of the cart object. need to update the total ticket count before resetting them
            if(this.cart[index].child >= 0 && this.cart[index].adult >= 0)
            {
                this.tot_tick -= this.cart[index].adult + this.cart[index].child; 
            }
            else if (this.cart[index].child >= 0)
            {
                this.tot_tick -= this.cart[index].child;
            }
            else if (this.cart[index].adult >= 0)
            {
                this.tot_tick -= this.cart[index].adult;
            }
            // now we reset the amounts
            this.cart[index].child = 0;
            this.cart[index].adult = 0;
            // finally we remove it 
            this.cart.splice(index, 1);
            //console.log(item);
            
            //find the cart item in the movies array with its id
            for(let i = 0; i < this.movies.length; i++)
            {
                if(item.id == this.movies[i].id)
                {
                    // reset all properties of this cart item
                    this.movies[i].adult = 0;
                    this.movies[i].child = 0;
                    // toggle boolean Card property to update the Card ticket data (thisadtick/thischtick)
                    this.movies[i].toremove = true;
                    //console.log("gotinside");
                }
            }
        }
    },
    components: {
        card: Card
    },
    computed: {
        totalcalc() {
            let total = 0;
            for (let i = 0; i < this.cart.length; i++) {
                // need some if blocks becuase the child and adult properties could be null, consequently we only utilize the opposite's total calculation
                if(this.cart[i].adult == null){
                    total += this.cart[i].child * 3.99;
                }
                else if(this.cart[i].child == null){
                    total += this.cart[i].adult * 6.99;
                }else{
                    total += (this.cart[i].adult * 6.99) + (this.cart[i].child * 3.99);
                }
            }
            //constantly returning the total
            return total;
        }
    }
}
Vue.createApp(theApp).mount("#mounter");