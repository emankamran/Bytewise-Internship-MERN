const person = {
    firstName: "John",
    lastName: "Doe",
    age: 21,
    walk: () => {
        console.log('Walk');
    },
    car: {
        brand: "Mclaren"
    }
}

console.log(person);
// const person2 = { ...person, car: { ...person.car } }
const person2 = JSON.parse(JSON.stringify(person));
person2.firstName = "Michael";
person2.car.brand = "Ferrari";
console.log(person2);

const parent = {
    firstName: "John",
    lastName: "Doe",
    age: 21,
    walk: () => {
        console.log('Walk');
    }
}

const child = {}
Object.setPrototypeOf(child,parent);
child.walk();
console.log(Object.getPrototypeOf(child));

console.log("Hello before print function");
const print = () => {
    setTimeout(() => {
        console.log("Inside Print");
    },2000);
}
print();
console.log("Hello after print function");

const fetchUser = (username, callback) => {
  setTimeout(() => {
    console.log("We have the user");
    callback({ username });
  }, 2000);
};

const fetchUserPhotos = (username, callback) => {
  setTimeout(() => {
    console.log(`We have ${username}'s photos`);
    callback(["Photo 1", "Photo 2"]);
  }, 2000);
};

const fetchPhotoDetails = (photos, callback) => {
  setTimeout(() => {
    console.log(`We have ${photos[0]}'s details`);
    callback("Details...");
  }, 2000);
};

fetchUser("John", (user) => {
  console.log(`The user is ${user.username}`);
  fetchUserPhotos(user.username, (photos) => {
    console.log(`Photos are ${photos}`);
    fetchPhotoDetails(photos, (details) => {
        console.log(details);
    })
  });
});

const promise = new Promise((resolve, reject) => {
  // resolve(5);
  reject("Promise rejected");
});

promise
  .then((number) => console.log(number))
  .catch((error) => console.log(error));

const fetchUser = async (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("We have the user");
      resolve({ username });
    }, 2000);
  });
};

const fetchUserPhotos = async (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`We have ${username}'s photos`);
      resolve(["Photo 1", "Photo 2"]);
    }, 2000);
  });
};

const fetchPhotoDetails = async (photos) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`We have ${photos}'s details`);
      resolve("Details...");
    }, 2000);
  });
};

const display = async () => {
    const user = await fetchUser("John");
    const photos = await fetchUserPhotos(user.username);
    const details = await fetchPhotoDetails(photos[1]);
    console.log(details);
}

display();

fetchUser("John")
  .then((user) => fetchUserPhotos(user.username))
  .then((photos) => fetchPhotoDetails(photos[1]))
  .then((details) => console.log(details));


  const promise = async () => {
    return 30;
  }
  
  const result = async () => {
    console.log(await promise());
  }

  result();
