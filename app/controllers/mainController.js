//* à supprimer en prod

const mainController = {
    async homePage(req, res){
        return res.json('Hello World');
    }
}

export {mainController};