exports.getDemo = (req, res, next)=>{
    const input = req.body.input
    console.log(input)
    res.render('demo',{
        path:'/'

    })
}