package com.kingweather.we_chat.bean;

import java.util.List;

public class ArticleTypeSouce {


    private List<ResultBean> result;

    public List<ResultBean> getResult() {
        return result;
    }

    public void setResult(List<ResultBean> result) {
        this.result = result;
    }

    public static class ResultBean {
        /**
         * id1 : -80536314760101496223459925924586193414
         * id2 : 143673350923794053862186139077033599987077080744603433250
         * score : 0.5276221821608774
         */

        private String id1;
        private String id2;
        private double score;
        private String id1Name;
        private String id2Name;

        public String getId1Name() {
            return id1Name;
        }

        public void setId1Name(String id1Name) {
            this.id1Name = id1Name;
        }

        public String getId2Name() {
            return id2Name;
        }

        public void setId2Name(String id2Name) {
            this.id2Name = id2Name;
        }

        public String getId1() {
            return id1;
        }

        public void setId1(String id1) {
            this.id1 = id1;
        }

        public String getId2() {
            return id2;
        }

        public void setId2(String id2) {
            this.id2 = id2;
        }

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }
    }
}
