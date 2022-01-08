function deleteProduct(event){
    const productId = event.parentNode.querySelector('[name=productId]').value;
    const csrf = event.parentNode.querySelector('[name=_csrf]').value;
    // const productElement = event.closest('article');
    fetch('/deleteDemo/'+productId, {
        method: "delete",
        headers:{
            'csrf-token': csrf
        }
    })
    .then(result=> {
        return result.json()
    })
    .then(data => {
        console.log(data)
        // productElement.parentNode.removeChild(productElement)
    })
    .catch(err => console.log(err))
}