let express = require("express");
let app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app Listening on port ${port}!`));

let {mobilesData} = require("./testData.js");

let fs = require("fs");
let fname = "mobiles.json";

app.get("/resetData",function(req,res){
    let data = JSON.stringify(mobilesData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
})


app.get("/mobiles", function (req, res) {
    let { brand,RAM,ROM,OS,sort } = req.query;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let mobilesArray = JSON.parse(data);

            let filteredMobiles = [...mobilesArray];

            if (brand) {
                filteredMobiles = filteredMobiles.filter((mobile) => {
                    return (
                        mobile.brand &&
                        mobile.brand.toLowerCase() === brand.toLowerCase()
                    );
                });
            }
            if (RAM) {
                filteredMobiles = filteredMobiles.filter((mobile) => {
                    return (
                        mobile.RAM &&
                        mobile.RAM.toLowerCase() === RAM.toLowerCase()
                    );
                });
            }

            if (ROM) {
                filteredMobiles = filteredMobiles.filter((mobile) => {
                    return (
                        mobile.ROM &&
                        mobile.ROM.toLowerCase() === ROM.toLowerCase()
                    );
                });
            }
            if (OS) {
                filteredMobiles = filteredMobiles.filter((mobile) => {
                    return (
                        mobile.OS &&
                        mobile.OS.toLowerCase() === OS.toLowerCase()
                    );
                });
            }

            if (sort) {
                if (sort === "name" || sort === "age" || sort === "salary") {
                    filteredMobiles.sort((a, b) => {
                        if (a[sort] < b[sort]) return -1;
                        if (a[sort] > b[sort]) return 1;
                        return 0;
                    });
                } else {
                    return res.status(400).send("Invalid sortBy parameter");
                }
            }

            res.send(filteredMobiles);
        }
    });
});



app.get("/mobiles/:id", function (req, res) {
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let mobilesArray = JSON.parse(data);
            let mobile = mobilesArray.find((st) => st.id === id);
            if (mobile) res.send(mobile);
            else res.status(404).send("No Mobile found");
        }
    });
});

// app.get("/svr/mobiles/brand/:brand", function (req, res) {
//     let brand = req.params.brand;
//     fs.readFile(fname, "utf8", function (err, data) {
//         if (err) res.status(404).send(err);
//         else {
//             let mobilesArray = JSON.parse(data);
//             let mobilesByBrand = mobilesArray.filter((st) => st.brand === brand);
//             console.log(mobilesByBrand);
//             res.send(mobilesByBrand);
//         }
//     });
// });


app.post("/mobiles", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let mobilesArray = JSON.parse(data);
            let maxid = mobilesArray.reduce(
                (acc, curr) => (curr.id > acc ? curr.id : acc),
                0
            );
            let newid = maxid + 1;
            let newMobile = { id: newid,...body };
            mobilesArray.push(newMobile);
            let data1 = JSON.stringify(mobilesArray);
            fs.writeFile(fname, data1, function (err) {
                if (err) res.status(404).send(err);
                else res.send(newMobile);
            });
        }
    });
});



app.put("/mobiles/:id", function (req, res) {
    let body = req.body;
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let mobilesArray = JSON.parse(data);
            let index = mobilesArray.findIndex((st) => st.id === id);
            if(index >= 0){
                let updatedMobile = {...mobilesArray[index],...body};
                mobilesArray[index] = updatedMobile;
                let data1 = JSON.stringify(mobilesArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updatedMobile);
                })
            }
            else res.status(404).send("No Mobile Found");
        }
    });
});


app.delete("/mobiles/:id", function (req, res) {
    let body = req.body;
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let mobilesArray = JSON.parse(data);
            let index = mobilesArray.findIndex((st) => st.id === id);
            if(index >= 0){
               let deletedMobile = mobilesArray.splice(index,1);
               let data1 = JSON.stringify(mobilesArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(deletedMobile);
                })
            }
            else res.status(404).send("No Mobile Found");
        }
    });
});


