import  express  from "express";

// AJV JSON Validator
import Ajv from "ajv"
const ajv = new Ajv()

const app = express()
app.use(express.json())

// View Engine*
app.set("view engine","ejs")

// Allow URL Encoded
app.use(express.urlencoded({extended:true}))

// QR Generator
import qr, { toDataURL } from "qrcode"

// Scan
app.get("/scan", async (req,res)=>{
    res.render("scan.ejs")
})


app.post("/scan", async (req,res)=>{
    let finalData = JSON.stringify(req.body.test)
    finalData = finalData.replace(/\\/g, "")


    let toJson = JSON.parse(req.body.test)


    // JSON Validator
    const schema = {type:"object",properties:{
        tipe:{type:"string"},
        nama:{type:"string"},
        harga:{type:"string"}
        },
        required: ["nama"],
        additionalProperties: false
    }
    const validate = ajv.compile(schema)

    const valid = validate(toJson)
    if(!valid){
        res.send("QR Invalid !")
      
        console.log(validate.errors)
    }
    else{

        res.send(finalData)
    }

})

// Create
app.get("/create", async (req,res)=>{
    res.render("create.ejs")
})

app.post("/create", async (req,res)=>{
    const {tipe,nama,harga} = req.body
    // let barang = await createBarang(tipe,nama,harga,stok)
    // console.log(barang)
    let content = `{"tipe":"${tipe}","nama":"${nama}","harga":"${harga}"}`
    if (content.length === 0) res.send("Empty Data!");

    qr.toDataURL(content, (err, src) => {
        if (err) res.send("Error occured");
      
        // const buf = new Buffer(src)
        // addImage(barang.id, buf)
        res.render("generatedQR.ejs", { src });
    });
})

app.listen(8080, ()=>{
    console.log("server is running on port 8080")
})
