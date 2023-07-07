class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
        // console.log(typeof(this.queryStr.keyword));
    }
    search(){
        const keyword=this.queryStr.keyword?
        {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            },
        }:{}
        this.query=this.query.find({...keyword});
        return this;
    }
    filter(){
        //category
        const qry={...this.queryStr};
        console.log(qry);
        const rmf=['keyword','page','limit'];
        rmf.forEach((key)=>{
           return delete qry[key];
        })
        console.log(qry);

        //price
        let queryStr = JSON.stringify(qry);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(pageResLimit) {
        const currentPage = Number(this.queryStr.page) || 1;
    
        const skip = pageResLimit * (currentPage - 1);
    
        this.query = this.query.limit(pageResLimit).skip(skip);
    
        return this;
    }

}



module.exports=ApiFeatures;