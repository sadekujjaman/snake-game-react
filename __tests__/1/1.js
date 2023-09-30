const CruzHarrell = require("./data.json");

const KatherineCohen = CruzHarrell.subordinates[0];
const RoxanneSimmons = CruzHarrell.subordinates[3];

// return names of all subordinates of person
const example1 = (person) => {
    return person.subordinates.map((subordinate) => subordinate.name);
};

test("Example 1: return names of all subordinates of person", () => {
    expect(example1(CruzHarrell)).toEqual([
        "Katherine Cohen",
        "Lucy Patton",
        "Moon Terry",
        "Roxanne Simmons",
        "Long Morales",
        "Velazquez Dotson",
        "Terri Cantrell",
        "Janna Patterson",
        "Angelina Walsh",
        "Morin Howard",
    ]);
});

// return company name from email address
const exercise11 = (email) => {
    let compNam = "";
    for (let i = 0; i < email.length; i++) {
        if (email[i] == '@') {
            i++;
            while (email[i] != '.') {
                compNam += email[i]
                i++;
            }
            break;
        }
    }
    return compNam;
};

test("Exercise 1.1: return company name from email address", () => {
    expect(exercise11("katherinecohen@ecraze.com")).toEqual("ecraze");
    expect(exercise11("lucypatton@geekwagon.com")).toEqual("geekwagon");
});

// given a person, return list of companies of her subordinates
const exercise12 = (person) => {
    let subs = person.subordinates;
    let lists = []
    for (let i = 0; i < subs.length; i++) {
        lists.push(exercise11(subs[i].email))
    }
    return lists;
};

test("Exercise 1.2: given a person, return list of companies of her subordinates", () => {
    expect(exercise12(CruzHarrell)).toEqual([
        "ecraze",
        "geekwagon",
        "isologix",
        "recognia",
        "rockabye",
        "enersave",
        "letpro",
        "geologix",
        "webiotic",
        "zoarere",
    ]);
    expect(exercise12(KatherineCohen)).toEqual([]);
});

// given a person and gender, return number of subordinates of person of given gender
const example2 = (person, gender) => {
    return person.subordinates.filter(
        (subordinate) => subordinate.gender === gender
    ).length;
};

test("Example 2: given a person and gender, return number of subordinates of person of given gender", () => {
    expect(example2(CruzHarrell, "female")).toEqual(6);
    expect(example2(KatherineCohen, "male")).toEqual(0);
});

// given a person and [minAge, maxAge], return number of subordinates in that age range
const exercise21 = (person, [minAge, maxAge]) => {

    let subs = person.subordinates;
    let count = 0;
    for (let i = 0; i < subs.length; i++) {
        if (subs[i].age >= minAge && subs[i].age <= maxAge) {
            count++;
        }
    }
    return count;

};

test("Exercise 2.1: given a person and [minAge, maxAge], return number of subordinates in that age range", () => {
    expect(exercise21(CruzHarrell, [21, 49])).toEqual(5);
    expect(exercise21(RoxanneSimmons, [55, 65])).toEqual(1);
});

// given a person, return the names of subordinates who themselves have subordinates
const exercise22 = (person) => {
    let subs = person.subordinates
    let namelist = []
    for (let i = 0; i < subs.length; i++) {
        let subsub = subs[i].subordinates;
        if (subsub.length > 0) {
            namelist.push(subs[i].name);
        }
    }
    return namelist;
};

test("Exercise 2.2: given a person, return the names of subordinates who themselves have subordinates", () => {
    expect(exercise22(CruzHarrell)).toEqual([
        "Moon Terry",
        "Roxanne Simmons",
        "Long Morales",
        "Velazquez Dotson",
        "Terri Cantrell",
        "Janna Patterson",
        "Angelina Walsh",
        "Morin Howard",
    ]);
    expect(exercise22(RoxanneSimmons)).toEqual(["Pat Bryan"]);
});

// given a person, return total balance of her subordinates
const example3 = (person) => {
    return person.subordinates.reduce(
        (total, subordinate) => total + subordinate.balance,
        0
    );
};

test("Example 3: given a person, return total balance of her subordinates", () => {
    expect(example3(CruzHarrell)).toBeCloseTo(49019.81);
    expect(example3(KatherineCohen)).toEqual(0);
});

// given a person, return average age of her subordinates
const exercise31 = (person) => {
    let subs = person.subordinates;
    let ages = 0;
    for (let i = 0; i < subs.length; i++) {
        ages += subs[i].age;
    }
    return ages / subs.length;
};

test("Exercise 3.1: given a person, return average age of her subordinates", () => {
    expect(exercise31(CruzHarrell)).toBeCloseTo(50.2);
    expect(exercise31(RoxanneSimmons)).toBeCloseTo(59);
});

// given a person, return difference between female and male subordinates
// e.g: if someone has 4 female subordinates and 7 male subordinates, return -3(=4-7)
const exercise32 = (person) => {
    let subs = person.subordinates;
    let maleCount = 0;
    let femaleCount = 0;
    for (let i = 0; i < subs.length; i++) {
        if (subs[i].gender == "male")  maleCount++;
        else femaleCount++;
    }
    return femaleCount - maleCount;
};

test("Exercise 3.2: given a person, return difference between female and male subordinates", () => {
    expect(exercise32(CruzHarrell)).toEqual(2);
    expect(exercise32(RoxanneSimmons)).toEqual(1);
});

// do the same exercise32, but with using only 1 reduce function and nothing else
const exercise32a = (person) => {
    let subs = person.subordinates;

    const difference = subs.reduce((cnt, p) => {

        if (p.gender === 'male') return cnt - 1;
        else return cnt + 1;


    }, 0)

    return difference;
};

test("Exercise 3.2a: given a person, return difference between female and male subordinates", () => {
    expect(exercise32a(CruzHarrell)).toEqual(2);
    expect(exercise32a(RoxanneSimmons)).toEqual(1);
});

/*
  for next three exercises,
  you can use if-else and/or for loops,
  but can't use any other functions
*/

// implement map function
const map = (array, func) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        let tempMap = func(array[i]);
        result.push(tempMap)
    }
    return result;
};

test("Exercise 4.1: implement map function", () => {
    const m1 = [Math.random(), Math.random(), Math.random(), Math.random()];
    expect(map(m1, (x) => 2 * x)).toEqual(m1.map((x) => 2 * x));

    const m2 = [CruzHarrell, KatherineCohen, RoxanneSimmons];
    expect(map(m2, (x) => x.age)).toEqual(m2.map((x) => x.age));
});

// implement filter function
const filter = (array, func) => {
    let result = []
    for (let index = 0; index < array.length; index++) {
        let resultItem = func(array[index])
        if (resultItem)
            result.push(array[index])
    }
    return result;
};

test("Exercise 4.2: implement filter function", () => {
    const f1 = [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
    ];
    expect(filter(f1, (x) => x > 0.5)).toEqual(f1.filter((x) => x > 0.5));

    const f2 = CruzHarrell.subordinates;
    expect(filter(f2, (x) => x.isActive)).toEqual(f2.filter((x) => x.isActive));
});

// implement reduce
const reduce = (array, func, initalValue) => {


    for (let i = 0; i < array.length; i++) {
        initalValue = func(initalValue, array[i])
    }

    return initalValue;
};

test("Exercise 4.3: implement reduce function", () => {
    const r1 = [Math.random(), Math.random(), Math.random(), Math.random()];
    expect(reduce(r1, (total, x) => total * x, 1)).toEqual(
        r1.reduce((total, x) => total * x, 1)
    );

    const r2 = CruzHarrell.subordinates;
    expect(
        reduce(r2, (total, subordinate) => total + subordinate.balance, 0)
    ).toEqual(r2.reduce((total, subordinate) => total + subordinate.balance, 0));
});

// return total number of people in the dataset
const example5 = () => {
    // a helper function to return number of people under specific person
    const getTotalPeople = (person) =>
        // count person herself
        1 +
        // recursively count total employees of all subordinates of person
        person.subordinates
        .map((subordinate) => getTotalPeople(subordinate))
        // add them together
        .reduce((total, employees) => total + employees, 0);

    // return number of people under the top-most person
    return getTotalPeople(CruzHarrell);
};

test("Example 5: return total number of people in the dataset", () => {
    expect(example5()).toEqual(109);
});

// given a color, return number of people who have that eye color
const exercise51 = (color) => {

    let res = []
    const getTotalPeople = (person) => {
        res.push(person);
        person.subordinates.map((sub) => getTotalPeople(sub));
    }
    getTotalPeople(CruzHarrell);
    let cnt = 0;
    for (let i = 0; i < res.length; i++) {
        if (res[i].eyeColor === color) cnt++;
    }
    return cnt;
};

test("Exercise 5.1: given a color, return number of people who have that eye color", () => {
    expect(exercise51("green")).toEqual(11);
});

const distance = (location1, location2) =>
    Math.sqrt(
        (location1.longitude - location2.longitude) *
        (location1.longitude - location2.longitude) +
        (location1.latitude - location2.latitude) *
        (location1.latitude - location2.latitude)
    );

test("distance: given two locations, return the distance between them", () => {
    expect(
        distance({ longitude: 67, latitude: 78 }, { longitude: 74, latitude: 102 })
    ).toEqual(25);
});

// given maxDistance, return number of employees who lives within maxDistance distance of their managers
const exercise52 = (maxDistance) => {
    let cnt = 0;
    Cal = (person) => {
        let psubs = person.subordinates;
        for (let i = 0; i < psubs.length; i++) {
            if (distance(person.location, psubs[i].location) <= maxDistance) cnt++;
            Cal(psubs[i]);

        }

    }
    Cal(CruzHarrell);

    return cnt;
};

test("Exercise 5.2: given maxDistance, return number of employees who lives within maxDistance distance of their managers", () => {
    expect(exercise52(5)).toEqual(25);
    expect(exercise52(10)).toEqual(81);
});

// return first name (not full name) of all person who has the same company as their manager
// hint: exercise11
const exercise53 = () => {
    let result = []

    const NameOfComp = (nam) => {
        let startIndex=nam.indexOf('@');
        let endIndex=nam.indexOf('.');
        return nam.substring(startIndex,endIndex);
    }

    const getEmployeesInSameCompanyWithManager = (person) => {

        let psubs = person.subordinates;

        let managerCom = NameOfComp(person.email);

        for (let i = 0; i < psubs.length; i++) {

            let nameEmp = NameOfComp(psubs[i].email);
            let Ename = psubs[i].name;

            if (managerCom === nameEmp) {
            //     let k = ""

            //     for (let j = 0; j < Ename.length; j++) {
            //         if (psubs[i].name[j] === ' ') break;
            //         k += psubs[i].name[j];
            //   //  }
                let indexOfFirstname=psubs[i].name.indexOf(' ');

                result.push(psubs[i].name.substring(0,indexOfFirstname));
            }

            getEmployeesInSameCompanyWithManager(psubs[i]);

        }

    }
   getEmployeesInSameCompanyWithManager(CruzHarrell);

    return result;
};

test("Exercise 5.3: return first name (not full name) of all person who has the same company as their manager", () => {
    expect(exercise53()).toEqual(["Suzanne", "Gregory", "Buchanan"]);
});