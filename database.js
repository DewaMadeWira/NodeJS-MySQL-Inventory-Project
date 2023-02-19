import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
}).promise()


async function getAllItems(){
    const [result] = await pool.query("SELECT * FROM tb_barang")
    return result
}

async function getItem(id){
    const [result] = await pool.query("SELECT * FROM tb_barang where id= ?",[id])
    return result
}

async function insertItem(nama,stok,harga){
    const [result] = await pool.query("INSERT INTO tb_barang (nama,stok,harga) VALUES (?,?,?)",[nama,stok,harga])
    return result
}

async function getAllTransactions(){
    const [result]=await pool.query("SELECT * FROM tb_transaksi")
    return result
}

async function getTransaction(id){
    const [result] = await pool.query("SELECT * FROM tb_transaksi where id = ?", [id])
    return result
}


async function insertTransaction(id,qty){
    const [item] = await getItem(id)
    let {nama,stok}=item
    let updatedStok = () =>{
        if(qty<=stok){
            return stok-qty
        }
    }
    await pool.query("UPDATE tb_barang SET stok = ? where id = ?", [updatedStok(),id])
    await pool.query("INSERT INTO tb_transaksi (quantity,id_barang) VALUES (?,?)", [qty,id]) 
}

async function showAllTransactionDate(date){
    const [item]= await pool.query("SELECT SUM(quantity) FROM tb_transaksi where tanggal = ?",[date])
    console.log(item)
}

async function showTransactionItemDate(date,id){
    const [item]= await pool.query("SELECT SUM(quantity),id_barang FROM tb_transaksi where tanggal = ? AND id_barang = ?",[date,id])
    console.log(item)
}


showAllTransactionDate("2023-02-19")
showTransactionItemDate("2023-02-19",1)