import axios from "axios";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = (props) => {
  //컴포넌트 내부에서 특정 DOM객체를 선택해야할 때
  const quillRef = useRef();
  const data = props.data;
  const setData = props.setData;
  const url = props.url;
  //이미지를 업로드하고 에디터 내부에 추가하는 함수
  const imageHandler = () => {
    //input 태그 생성
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    //비동기요청을 동기처리해라
    input.onchange = async () => {
      const file = input.files;
      if (file !== null) {
        const form = new FormData();
        form.append("image", file[0]);
        const token = window.localStorage.getItem("token");
        axios
          .post(url, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            console.log(res.data);
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", res.data);
            editor.setSelection(range.index + 1);
          })
          .catch((res) => {
            console.log(res.response.status);
          });
      }
    };
  };
  //quill에디터 형식옵션을 담는 배열
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];
  //useMemo : 동일값을 반환하는경우 함수를 반복적으로 호출하는 것이아니라 메모리에 저장해두고
  //바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      toolbar: {
        //툴바에 넣을 기능을 순서대로 나열
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          //이미지업로드 버튼 클릭시 우리가 만든 함수가 동작하도록 설정
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);
  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={data}
      formats={formats}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;
