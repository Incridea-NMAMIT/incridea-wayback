import React from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import QuizImageUpload from "./quizImageUpload";

type QuestionProps = {
  id: string;
  questionText: string;
  options: string[];
  index: number;
  ansIndex: number;
  collapsed: boolean;
  isCode: boolean;
  description: string;
  questionMode: string;
  imageUrl: string;
  handleImage: (id: string, value: string) => void;
  toggleCollapase: (id: string) => void;
  handleQuestionTextChange: (id: string, value: string) => void;
  handleOptionChange: (id: string, optionIndex: number, value: string) => void;
  handleAnswerChange: (
    id: string,
    optIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleAddQuestions: (index: number) => void;
  handleDeleteQuestions: (id: string) => void;
  handleCopyQuestion: (id: string, index: number) => void;
  handleIsCode: (id: string) => void;
  handleDescriptionChange: (id: string, value: string) => void;
};

const QuestionComp: React.FC<QuestionProps> = (props) => {
  const handleImageFromUpload = (url: string) => {
    props.handleImage(props.id, url);
  };

  return (
    <div key={props.id} id={props.id} className="flex pt-8 pb-3">
      <div
        className={`flex h-auto w-full flex-col items-start rounded-3xl bg-gradient-to-br from-[#002C1D]/95 py-6 px-8 ${props.questionMode === "edit" ? "border-2 border-blue-500" : props.questionMode === "new" ? "border-2 border-green-500" : ""}`}
      >
        <div className="flex align-middle justify-between w-full">
          <div className="flex flex-row gap-10">
            <h1
              className="font-gilroy text-xl font-medium cursor-pointer"
              onClick={() => props.toggleCollapase(props.id)}
            >
              {props.collapsed
                ? `► Question ${props.index + 1}`
                : `▼ Question ${props.index + 1}`}
            </h1>

            {props.collapsed && (
              <h2
                className="font-gilroy text-lg font-medium cursor-pointer truncate max-w-xs"
                onClick={() => props.toggleCollapase(props.id)}
              >
                {props.questionText}
              </h2>
            )}
          </div>

          <div className="flex w-40 flex-row items-center justify-around rounded-2xl cursor-pointer">
            <HiOutlineDuplicate
              className="text-3xl hover:rounded-lg hover:bg-slate-800"
              onClick={() => props.handleCopyQuestion(props.id, props.index)}
            />
            <MdDeleteOutline
              className="text-3xl hover:rounded-lg hover:bg-slate-800 cursor-pointer"
              onClick={() => props.handleDeleteQuestions(props.id)}
            />
          </div>
        </div>
        {!props.collapsed && (
          <>
            <div className="flex w-full flex-row items-center">
              <input
                className="mt-4 h-16 w-[1000px] rounded-3xl bg-slate-600 bg-opacity-20 bg-clip-padding px-4 outline-none backdrop-blur-3xl backdrop-filter"
                type="text"
                placeholder="Enter Question"
                value={props.questionText}
                onChange={(e) =>
                  props.handleQuestionTextChange(props.id, e.target.value)
                }
              ></input>
            </div>
            <div className="mt-6 w-full ml-2">
              <label
                htmlFor={`code-${props.id}`}
                className="w-full text-lg mr-4 font-semibold dark:text-gray-300"
              >
                Is a Code Snippet?
              </label>
              <input
                required
                type="checkbox"
                // {...(props.isCode ? { checked: true } : {})}
                className="mr-2 w-4 h-4 checked:accent-amber-300"
                id="code-${props.id}"
                checked={props.isCode} // new change
                onChange={() => props.handleIsCode(props.id)}
              />
            </div>
            <div className="flex gap-12 mt-2 w-full flex-row items-center">
              <textarea
                name="desc"
                id="desc"
                rows={7}
                className="h-auto w-[600px] rounded-3xl bg-slate-600 bg-opacity-20 bg-clip-padding px-4 py-6 outline-none backdrop-blur-3xl backdrop-filter"
                placeholder="Description (Or Code)"
                value={props.description}
                onChange={(e) =>
                  props.handleDescriptionChange(props.id, e.target.value)
                }
              ></textarea>

              <div
                className="
           flex gap-4"
              >
                <QuizImageUpload
                  // setImage={(file) => {
                  //         setSaved(false);
                  //         setImageFiles((prev) => {
                  //           const newFiles = [...prev];
                  //           newFiles[0] = file;
                  //           return newFiles;
                  //         });
                  //       }}
                  handleImageUpload={handleImageFromUpload}
                  existingImage={props.imageUrl === "" ? null : props.imageUrl}
                  loading={false}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 justify-between w-full mt-4 gap-8 px-6 pb-4">
              {props.options.map((opt, index2) => (
                <div
                  key={index2}
                  className="mt-4 flex flex-row items-center justify-center gap-3"
                >
                  <div className="flex flex-row items-center justify-center w-full gap-4">
                    {/* {index2 + 1} */}
                    <input
                      className="mr-4 w-full rounded-2xl bg-slate-600 bg-opacity-30 bg-clip-padding p-2 px-4 py-3 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
                      placeholder={`Enter option ${index2 + 1}`}
                      value={opt}
                      onChange={(e) =>
                        props.handleOptionChange(
                          props.id,
                          index2,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      required
                      id={`answer-${props.id}-${index2 + 1}`}
                      type="radio"
                      value={opt}
                      name={`ans-${props.id}`}
                      className="h-4 w-4 border-gray-300 bg-gray-100 order-amber-300 text-emerald-700 focus:ring-2 focus:ring-emerald-700"
                      checked={props.ansIndex === index2}
                      onChange={(e) =>
                        props.handleAnswerChange(props.id, index2, e)
                      }
                    />
                    <label
                      htmlFor={`answer-${props.id}-${index2 + 1}`}
                      className="w-full py-4 text-lg font-semibold dark:text-gray-300 text-nowrap"
                    >
                      Is Answer?
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionComp;
