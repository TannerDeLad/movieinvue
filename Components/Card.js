export default {
    template:
    // below we have the template for the card component. i used mainly bootstrap stuff for it with the buttons reacting to their respectiving methods. we also have onclick="return false" because the button would scroll to the top and this was a work around for it 
        `
    <div class="card" style="width: 18rem;">
        <img v-bind:src=movobj.img class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{movobj.title}}</h5>
            <p class="card-text">{{movobj.overview}}</p>
            <div class="buttongrab">
                <a href="#" class="btn btn-primary" v-on:click=addadtick onclick="return false">Adult Ticket</a>
                <a href="#" class="btn btn-primary" v-on:click=addchtick onclick="return false">Child Ticket</a>
            </div>
        </div>
    </div>
    `,
    // passing of the movobj
    props: ["movobj"],
    methods: {
        addchtick() {
            //console.log(this.movobj.toremove);
            // if the movobj passed has the property set to big reset then we reset both of the ticket values
            if(this.movobj.toremove)
            {
                //console.log("got");
                this.thisadtick = 0;
                this.thischtick = 0;
            }
            // afterword we toggle it back to false so that it doesn't happen again unless it's clicked
            this.movobj.toremove = false;
            // same concept as above, except now we are using it for the child function. Additionally, the cart.child/adult property will update within the app.js so we don't have to decrement it here instead we just reassign it's value to what the passed movobj's value is 
            if(this.movobj.removechild)
            {
                this.thischtick = this.movobj.child;
            }
            // reset the boolean prop
            this.movobj.removechild = false;
            // since this is being called on an add ticket button, we add more to it 
            this.thischtick++;
            // counter intuitively, now we reassign the value of movobj.child to the card components value so that it is accurate
            this.movobj.child = this.thischtick;
            //pass the whole damn thang owo
            this.$emit('added', this.movobj);
            //console.log(this.thischtick);
            //console.log("new");
        },
        addadtick() {
            // similar as above except with adult tickets
            if(this.movobj.toremove)
            {
                //console.log("got");
                this.thisadtick = 0;
                this.thischtick = 0;
            }
            this.movobj.toremove = false;
            if(this.movobj.removeadult)
            {
                //console.log("it is being ")
                this.thisadtick = this.movobj.adult;
            }
            this.movobj.removeadult = false;
            this.thisadtick++;
            this.movobj.adult = this.thisadtick;
            this.$emit('added', this.movobj);
            //console.log("this " + this.thisadtick);
            //console.log("new");
        }
    },
    data() {
        return {
            thischtick: 0,
            thisadtick: 0
        }
    }
}