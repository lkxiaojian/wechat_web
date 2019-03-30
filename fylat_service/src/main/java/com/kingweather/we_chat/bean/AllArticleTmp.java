package com.kingweather.we_chat.bean;

import java.util.List;

public class AllArticleTmp {


    private List<ResultBean> result;

    public List<ResultBean> getResult() {
        return result;
    }

    public void setResult(List<ResultBean> result) {
        this.result = result;
    }

    public static class ResultBean {
        /**
         * article_type_id : 4920058114977737692
         * article_type_keyword : ["卞","告柊瑙","寜浜","寰俊","琚","璐","璧炶","繃浜","氬","鍙楄嫻鏋"]
         * is_paper : 0
         * parent_type_id : -2
         */

        private String article_type_id;
        private int is_paper;
        private List<String> parent_type_id;
        private List<String> article_type_keyword;

        public String getArticle_type_id() {
            return article_type_id;
        }

        public void setArticle_type_id(String article_type_id) {
            this.article_type_id = article_type_id;
        }

        public int getIs_paper() {
            return is_paper;
        }

        public void setIs_paper(int is_paper) {
            this.is_paper = is_paper;
        }

        public List<String> getParent_type_id() {
            return parent_type_id;
        }

        public void setParent_type_id(List<String> parent_type_id) {
            this.parent_type_id = parent_type_id;
        }

        public List<String> getArticle_type_keyword() {
            return article_type_keyword;
        }

        public void setArticle_type_keyword(List<String> article_type_keyword) {
            this.article_type_keyword = article_type_keyword;
        }

        @Override
        public String toString() {
            return "ResultBean{" +
                    "article_type_id='" + article_type_id + '\'' +
                    ", is_paper=" + is_paper +
                    ", parent_type_id='" + parent_type_id + '\'' +
                    ", article_type_keyword=" + article_type_keyword +
                    '}';
        }
    }
}
