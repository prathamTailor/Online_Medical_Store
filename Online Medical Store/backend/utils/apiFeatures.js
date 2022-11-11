const dotenv = require('dotenv').config({path: "backend/config/config.env"});

class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options: "i",
            }
        } : {};
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const newQueryStr = {...this.queryStr};// To avoid js reference error
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete newQueryStr[key]);

        // Filter for price and rating (range fields)
        let queryStr = JSON.stringify(newQueryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage){
        resultPerPage = Number(resultPerPage) || process.env.RESULT_PER_PAGE;
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage*(currentPage-1);
        this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;