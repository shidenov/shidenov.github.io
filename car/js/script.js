const Events = (() => {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("load", () => {
    document.querySelector(".preloader").classList.add("hidePreloader");
  });

  window.addEventListener("scroll", () => {
    let height = document.documentElement.scrollTop;
    height > 80
      ? navbar.classList.add("navbar-change")
      : navbar.classList.remove("navbar-change");
  });
})();

// create cars
const CreateCars = (() => {
  // car data
  const cars = [];
  // car class
  class Car {
    constructor(make, country, img, special, model, price, type, trans, gas) {
      this.make = make;
      this.country = country;
      this.img = img;
      this.special = special;
      this.model = model;
      this.price = price;
      this.type = type;
      this.trans = trans;
      this.gas = gas;
    }
  }
  // car creation function
  function makeCar(
    make,
    country,
    img = "img/car-default.jpeg",
    special = true,
    model = "new model",
    price = 10000,
    type = "sedan",
    trans = "automatic",
    gas = "50"
  ) {
    const car = new Car(
      make,
      country,
      img,
      special,
      model,
      price,
      type,
      trans,
      gas
    );
    cars.push(car);
  }

  // produce cars
  function produceCars() {
    makeCar("chevy", "american");
    makeCar("mercedes", "german", "img/car-german-1.jpeg", true);
    makeCar("bmw", "german", "img/car-german-2.jpeg");
    makeCar("bmw", "german", "img/car-german-3.jpeg", false, "some model");
    makeCar("bmw", "german", "img/car-german-4.jpeg", undefined, "other model");
    makeCar("mercedes", "german", "img/car-german-5.jpeg", false);
    makeCar("chevy", "american", "img/car-american-1.jpeg");
    makeCar("chevy", "american", "img/car-american-2.jpeg", false);
    makeCar("chevy", "american", "img/car-american-3.jpeg", false);
    makeCar("chevy", "american", "img/car-american-4.jpeg", false);
    makeCar("chevy", "american", "img/car-american-5.jpeg", false);
  }
  produceCars();
  // special cars
  const specialCars = cars.filter(car => car.special == true);

  return {
    cars,
    specialCars
  };
})();

// display all cars
const DisplayCars = (CreateCars => {
  const cars = CreateCars.cars;
  const inventory = document.querySelector(".inventory-container");
  document.addEventListener("DOMContentLoaded", () => {
    inventory.innerHTML = "";
    let output = "";
    cars.forEach(car => {
      output += ` <!-- single car -->
        <div class="col-10 mx-auto my-3 col-md-6 col-lg-4 single-car ${
          car.country
        }">
          <div class="card car-card">
            <img src="${car.img}" class="card-img-top car-img" alt="">
            <!-- card body -->
            <div class="card-body">
              <div class="car-info d-flex justify-content-between">
                <!-- first flex child -->
                <div class="car-text text-uppercase">
                  <h6 class="font-weight-bold">${car.make}</h6>
                  <h6>${car.model}</h6>
                </div>
                <!-- second flex child -->
                <h5 class="car-value align-self-center py-2 px-3">$
                  <span class="car-price">${car.price}</span>
                </h5>
              </div>
            </div>
            <!-- end of card -->
            <div class="card-footer text-capitalize d-flex justify-content-between">
              <p><span><i class="fas fa-car"></i></span>${car.type}</p>
              <p><span><i class="fas fa-cogs"></i></span>${car.trans}</p>
              <p><span><i class="fas fa-gas-pump"></i></span>${car.gas}</p>
            </div>
          </div>
        </div>
        <!--end of single car -->`;
    });
    inventory.innerHTML = output;
  });
})(CreateCars);

// filter cars
const FilterCars = (() => {
  const filter = document.querySelectorAll(".filter-btn");
  filter.forEach(btn => {
    btn.addEventListener("click", event => {
      const value = event.target.dataset.filter;
      const singleCars = document.querySelectorAll(".single-car");

      singleCars.forEach(car => {
        if (value === "all") {
          car.style.display = "block";
        } else {
          !car.classList.contains(value)
            ? (car.style.display = "none")
            : (car.style.display = "block");
        }
      });
    });
  });
})();

// show modal
const Gallery = (() => {
  const items = document.querySelectorAll(".gallery-item");
  const showcase = document.querySelector(".showcase");

  items.forEach(item => {
    item.addEventListener("click", event => {
      showcase.classList.add("showcase-show");
      if (event.target.classList.contains("gallery-item")) {
        let src = event.target.childNodes[1].src;
        document.querySelector(".showcase-img").src = src;
      }
    });
  });
  document.querySelector(".showcase-close").addEventListener("click", () => {
    showcase.classList.remove("showcase-show");
  });
})();
