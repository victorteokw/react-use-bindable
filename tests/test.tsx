import "global-jsdom/register"
import { describe, it, expect } from '@jest/globals'
import React, { createElement } from 'react'
import { render, fireEvent, getByText } from '@testing-library/react'
import useBindable from '../src'
import type { Binding } from '../src'

describe('useBindable', () => {
  it("works for object", () => {
    const Editor = ({ children }: { children: Binding<string> }) => {
      return <textarea className="editor" value={children.value} onChange={(e) => children.set(e.target.value)} />
    }
    const Container = () => {
      const binding = useBindable({ title: "Title", content: "Content" })
      return (
        <div>
          <h1>{binding.value.title}</h1>
          <p>{binding.value.content}</p>
          <Editor>{binding.binding('content')}</Editor>
        </div>
      )
    }
    const containerElement = createElement(Container)
    const container = render(containerElement).container
    const textarea = container.querySelector(".editor")
    fireEvent.change(textarea!, {target: {value: 'Updated Content'}})
    const p = container.querySelector("p")
    expect(getByText(p!, "Updated Content")).toBeTruthy()
  })

  it("works for array", () => {
    const Editor = ({ children }: { children: Binding<string> }) => {
      return <textarea className="editor" value={children.value} onChange={(e) => children.set(e.target.value)} />
    }
    const Container = () => {
      const binding = useBindable(["Title", "Content"])
      return (
        <div>
          <h1>{binding.value[0]}</h1>
          <p>{binding.value[1]}</p>
          <Editor>{binding.binding(1)}</Editor>
        </div>
      )
    }
    const containerElement = createElement(Container)
    const container = render(containerElement).container
    const textarea = container.querySelector(".editor")
    fireEvent.change(textarea!, {target: {value: 'Updated Content'}})
    const p = container.querySelector("p")
    expect(getByText(p!, "Updated Content")).toBeTruthy()
  })

  it("is nested", () => {
    const Editor = ({ className, children }: { className: string, children: Binding<string> }) => {
      return <textarea className={className} value={children.value} onChange={(e) => children.set(e.target.value)} />
    }
    const Section = ({ className, children }: { className: string, children: Binding<{ title: string, content: string }>}) => {
      return (
        <div className={className}>
          <h1>{children.value.title}</h1>
          <p>{children.value.content}</p>
          <Editor className={className + "_editor"}>{children.binding('content')}</Editor>
        </div>
      )
    }
    const Container = () => {
      const binding = useBindable({
        "section1": {
          "title": "Title 1",
          "content": "Content 1"
        },
        "section2": {
          "title": "Title 2",
          "content": "Content 2"
        }
      })
      return (
        <div>
          <Section className="section1">{binding.binding('section1')}</Section>
          <Section className="section2">{binding.binding('section2')}</Section>
        </div>
      )
    }
    const containerElement = createElement(Container)
    const container = render(containerElement).container
    const section1 = container.querySelector(".section1")!
    const textarea = section1.querySelector('.section1_editor')
    fireEvent.change(textarea!, { target: { value: 'Updated Content 1' } })
    const p = section1.querySelector("p")!
    expect(getByText(p, "Updated Content 1")).toBeTruthy()
  })
})
