package com.kingweather.we_chat.controller.download;

import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.metadata.Sheet;
import com.alibaba.excel.metadata.Table;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.kingweather.we_chat.service.ExcleDownloadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Description: wechat_web1
 * Created by s on 2019/4/13 20:02
 */
@RestController
@RequestMapping("/excleDownload")
public class ExcleDownloadController {

    @Resource
    private ExcleDownloadService excleDownloadService;

    @GetMapping("/article/rest")
    public void selArticle(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String, Object> info ) throws Exception{
        OutputStream out = null;
        try {

            List<Map<String,Object>> list = excleDownloadService.selArticle(info);

            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition", "attachment;fileName=Article.xlsx");
            out =response.getOutputStream();
            ExcelWriter writer = new ExcelWriter(out, ExcelTypeEnum.XLSX);
            Sheet sheet = new Sheet(1, 0);
            List<List<String>> data = new ArrayList<>();
            for (Map m : list) {
                List<String> item = new ArrayList<>();
                item.add(m.get("article_id")==null?"":m.get("article_id").toString());
                item.add(m.get("article_type_name")==null?"":m.get("article_type_name").toString());
                item.add(m.get("article_title")==null?"":m.get("article_title").toString());
                item.add(m.get("article_title_e")==null?"":m.get("article_title_e").toString());
                item.add(m.get("article_keyword")==null?"":m.get("article_keyword").toString());
                item.add(m.get("article_keyword_e")==null?"":m.get("article_keyword_e").toString());
                item.add(m.get("author")==null?"":m.get("author").toString());
                item.add(m.get("author_e")==null?"":m.get("author_e").toString());
                item.add(m.get("update_time")==null?"":m.get("update_time").toString());
                item.add(m.get("create_time")==null?"":m.get("create_time").toString());
                item.add(m.get("source")==null?"":m.get("source").toString());
                item.add(m.get("content_excerpt")==null?"":m.get("content_excerpt").toString());
                item.add(m.get("content_excerpt_e")==null?"":m.get("content_excerpt_e").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());
                item.add(m.get("check_type")==null?"":m.get("check_type").toString());
                item.add(m.get("article_score")==null?"":m.get("article_score").toString());
                item.add(m.get("simhash")==null?"":m.get("simhash").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());
                item.add(m.get("posting_name")==null?"":m.get("posting_name").toString());
                item.add(m.get("pdf_path")==null?"":m.get("pdf_path").toString());
                item.add(m.get("reference")==null?"":m.get("reference").toString());
                item.add(m.get("site_number")==null?"":m.get("site_number").toString());
                item.add(m.get("seach_keyword")==null?"":m.get("seach_keyword").toString());
                item.add(m.get("publication_date")==null?"":m.get("publication_date").toString());
                if(m.get("details_txt")!=null){
                    byte[] b = (byte[]) m.get("details_txt");
                    String txt = new String(b  ,"utf-8");
                    item.add(txt);
                    item.add(txt.length()+"");
                }else{
                    item.add("");
                    item.add("");
                }
                data.add(item);
            }

            List<List<String>> head = new ArrayList<List<String>>();

            String[] headTitle = {"论文id","论文类型","论文标题","题目英文","关键字","关键词英文","作者","作者英文","更新时间","发布时间","来源","论文摘要",
                    "摘要英文","图片地址","是否审核","分数","论文去重","刊期名称","pdf路径","参考文献","网站序号","搜索关键词",
                    "刊出卷期","文本信息","字数"};
            for (int i=0,num=headTitle.length;i<num;i++){
                head = getHead(head,headTitle[i]);
            }

            Table table = new Table(1);
            table.setHead(head);

            writer.write0(data,sheet,table);
            writer.finish();

        } catch (Exception e) {
        }finally {
            if(out != null)out.close();
        }

    }


    @GetMapping("/articleTmp/rest")
    public void selArticleTmp(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String, Object> info ) throws Exception{
        OutputStream out = null;
        try {
            List<Map<String,Object>> list = excleDownloadService.selArticleTmp(info);

            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition", "attachment;fileName=ArticleTmp.xlsx");
            out =response.getOutputStream();
            ExcelWriter writer = new ExcelWriter(out, ExcelTypeEnum.XLSX);
            Sheet sheet = new Sheet(1, 0);
            List<List<String>> data = new ArrayList<>();
            String code;
            for (Map m : list) {
                List<String> item = new ArrayList<>();

                item.add(m.get("article_id")==null?"":m.get("article_id").toString());
                item.add(m.get("article_type_name")==null?"":m.get("article_type_name").toString());
                item.add(m.get("article_title")==null?"":m.get("article_title").toString());
                item.add(m.get("article_keyword")==null?"":m.get("article_keyword").toString());
                item.add(m.get("author")==null?"":m.get("author").toString());
                item.add(m.get("update_time")==null?"":m.get("update_time").toString());
                item.add(m.get("create_time")==null?"":m.get("create_time").toString());
                item.add(m.get("source")==null?"":m.get("source").toString());
                item.add(m.get("content_excerpt")==null?"":m.get("content_excerpt").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());
                if(m.get("details_txt")!=null){
                    byte[] b = (byte[]) m.get("details_txt");
                    String txt = new String(b  ,"utf-8");
                    item.add(txt);
                    item.add(txt.length()+"");
                }else{
                    item.add("");
                    item.add("");
                }
                item.add(m.get("check_type")==null?"":m.get("check_type").toString());
                item.add(m.get("article_score")==null?"":m.get("article_score").toString());
                item.add(m.get("simhash")==null?"":m.get("simhash").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());

                data.add(item);
            }

            String[] headTitle = {"文章id","文章类型","文章标题","关键字","作者","更新时间","发布时间","来源","文章摘要",
                    "图片地址","文本信息","字数","是否审核","分数","文章去重"};
            List<List<String>> head = new ArrayList<List<String>>();
            for (int i=0,num=headTitle.length;i<num;i++){
                head = getHead(head,headTitle[i]);
            }

            Table table = new Table(1);
            table.setHead(head);

            writer.write0(data,sheet,table);
            writer.finish();

        } catch (Exception e) {
        }finally {
            if(out != null)out.close();
        }

    }

    private  List<List<String>> getHead( List<List<String>> head ,String coulumnlTitle){
        List<String> headCoulumn1 = new ArrayList<String>();
        headCoulumn1.add(coulumnlTitle);
        head.add(headCoulumn1);
        return head;
    }

    @GetMapping("/academicPaper/rest")
    public void selAcademicPaper(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String, Object> info) throws Exception{
        OutputStream out = null;
        try {

            List<Map<String,Object>> list = excleDownloadService.selAcademicPaper(info);

            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition", "attachment;fileName=AcademicPaper.xlsx");
            out =response.getOutputStream();
            ExcelWriter writer = new ExcelWriter(out, ExcelTypeEnum.XLSX);
            Sheet sheet = new Sheet(1, 0);
            List<List<String>> data = new ArrayList<>();
            for (Map m : list) {
                List<String> item = new ArrayList<>();
                item.add(m.get("article_id")==null?"":m.get("article_id").toString());
                item.add(m.get("article_type_name")==null?"":m.get("article_type_name").toString());
                item.add(m.get("article_title")==null?"":m.get("article_title").toString());
                item.add(m.get("article_title_e")==null?"":m.get("article_title_e").toString());
                item.add(m.get("article_keyword")==null?"":m.get("article_keyword").toString());
                item.add(m.get("article_keyword_e")==null?"":m.get("article_keyword_e").toString());
                item.add(m.get("author")==null?"":m.get("author").toString());
                item.add(m.get("author_e")==null?"":m.get("author_e").toString());
                item.add(m.get("update_time")==null?"":m.get("update_time").toString());
                item.add(m.get("create_time")==null?"":m.get("create_time").toString());
                item.add(m.get("source")==null?"":m.get("source").toString());
                item.add(m.get("content_excerpt")==null?"":m.get("content_excerpt").toString());
                item.add(m.get("content_excerpt_e")==null?"":m.get("content_excerpt_e").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());
                item.add(m.get("check_type")==null?"":m.get("check_type").toString());
                item.add(m.get("article_score")==null?"":m.get("article_score").toString());
                item.add(m.get("simhash")==null?"":m.get("simhash").toString());
                item.add(m.get("image_path")==null?"":m.get("image_path").toString());
                item.add(m.get("posting_name")==null?"":m.get("posting_name").toString());
                item.add(m.get("pdf_path")==null?"":m.get("pdf_path").toString());
                item.add(m.get("reference")==null?"":m.get("reference").toString());
                item.add(m.get("site_number")==null?"":m.get("site_number").toString());
                item.add(m.get("seach_keyword")==null?"":m.get("seach_keyword").toString());
                item.add(m.get("publication_date")==null?"":m.get("publication_date").toString());

                data.add(item);
            }

            List<List<String>> head = new ArrayList<List<String>>();

            String[] headTitle = {"论文id","论文类型","论文标题","题目英文","关键字","关键词英文","作者","作者英文","更新时间","发布时间","来源","论文摘要",
                    "摘要英文","图片地址","是否审核","分数","论文去重","刊期名称","pdf路径","参考文献","网站序号","搜索关键词",
            "刊出卷期"};
            for (int i=0,num=headTitle.length;i<num;i++){
                head = getHead(head,headTitle[i]);
            }

            Table table = new Table(1);
            table.setHead(head);

            writer.write0(data,sheet,table);
            writer.finish();

        } catch (Exception e) {
        }finally {
            if(out != null)out.close();
        }

    }
}
