package com.kingweather.we_chat.bean;

import java.util.List;

public class ArticleTmp {


    private List<ResultBean> result;

    public List<ResultBean> getResult() {
        return result;
    }

    public void setResult(List<ResultBean> result) {
        this.result = result;
    }

    public static class ResultBean {
        /**
         * article_id : 1
         * article_keywords : ["盈创","打印","3D","建筑","绿化","站台","公交","CGTN","固体废弃物","内装"]
         * type_id : [2,28973]
         * type_name : ["中国","企业","提升","产品","关键","行业","全球","国内","生产","处于"]
         */

        private String article_id;
        private List<String> article_keywords;
        private List<String> type_id;
        private List<String> type_name;

        public String getArticle_id() {
            return article_id;
        }

        public void setArticle_id(String article_id) {
            this.article_id = article_id;
        }

        public List<String> getArticle_keywords() {
            return article_keywords;
        }

        public void setArticle_keywords(List<String> article_keywords) {
            this.article_keywords = article_keywords;
        }

        public List<String> getType_id() {
            return type_id;
        }

        public void setType_id(List<String> type_id) {
            this.type_id = type_id;
        }

        public List<String> getType_name() {
            return type_name;
        }

        public void setType_name(List<String> type_name) {
            this.type_name = type_name;
        }
    }
}
