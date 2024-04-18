import React, { useLayoutEffect }from 'react';
import { createPortal } from "react-dom";
import { useEditTodoViewModel } from '../view_models/edit_todo_view_model';

interface ReactPortalProps {
  children: React.ReactNode;
  wrapperId:string;
}

function createWrapperAndAppendToBody(wrapperId:string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}


function ReactPortal({children, wrapperId = "react-portal-wrapper"}: ReactPortalProps){
  const editTodoVm = useEditTodoViewModel();
  // synchronous? directly mutating the DOM -> not useEffect but useLayoutEffect
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    editTodoVm.setWrapperElementId(wrapperId);
    return () => {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);
  const element = document.getElementById(wrapperId)
  return element ? createPortal(children, element) : null;
}

export default ReactPortal;