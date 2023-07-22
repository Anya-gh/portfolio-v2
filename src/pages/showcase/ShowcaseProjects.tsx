import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tag from '../../components/Tag'
import * as data from '../../../public/data.json'


const projects = data['projects']
const tags = data['tags']

export type Projects = {
  id: number,
  title: string,
  keywords: string[],
  date: string,
  role: string,
  description: string,
  github: string
}

interface ShowcaseProjectsProps {
  filteredTags: string[],
  setFilteredTags: Dispatch<SetStateAction<string[]>>,
  filteredProjects: Projects[],
  setFilteredProjects: Dispatch<SetStateAction<Projects[]>>
}

export default function ShowcaseProjects( {filteredTags, setFilteredTags, filteredProjects, setFilteredProjects} : ShowcaseProjectsProps ) {

  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const onClickLeft = () => {
    setDirection(-1)
    setActive(active => active === 0 ? filteredProjects.length - 1 : active - 1)
  }

  const onClickRight = () => {
    setDirection(1)
    setActive(active => active === filteredProjects.length - 1 ? 0: active + 1)
  }

  const variants = {
    right: {opacity: 0, x:"100%"},
    left: {opacity: 0, x:"-100%"},
  }

  useEffect(() => {
    const filteredTagsSet = new Set(filteredTags)
    console.log('tags: %o', filteredTagsSet)
    let newProjects = projects.filter(
      project => {
        const keywordsSet = new Set(project.keywords);
        console.log('keywords: %o', keywordsSet)
        if (filteredTags.length == 0) {
          console.log('true')
          return true;
        }
        else {
          for (const tag of filteredTagsSet) {
            if (!keywordsSet.has(tag)) {
              return false;
            }
          }
          return true;
        }
      }
    )
    if (newProjects.length == 0) {
      newProjects = [{
        "id": 1,
        "title": "Sorry, no projects with these tags.",
        "date": "",
        "description": "Try selecting some different tags!",
        "keywords": [],
        "role": "",
        "github": ""
      }]
    }
    setFilteredProjects(newProjects)
    console.log(newProjects)
    setActive(active => active > newProjects.length - 1 ? 0: active)
  }, [filteredTags])

  return (
    <>
    <div className="pb-20 flex flex-row pt-10 self-center justify-evenly items-center overflow-hidden w-full">
      <button onClick={onClickLeft}><img className="invert m-0 w-auto h-10 rotate-90 hover:scale-150 hover:cursor-pointer transition duration-200" src={'../../images/down.png'} alt={'chevron'}/></button>
        <div className="w-auto items-center">
        <AnimatePresence initial={false} mode='wait'>
            <motion.div key={active} variants={variants} initial={direction === 1 ? 'left' : 'right'} animate={{opacity: 1, x: 0, transition: {duration: 0.5}}} exit={direction === 1 ? "right" : "left"}>
              <div className='flex flex-col border-2 rounded-xl h-72 w-[40rem] mt-10 transition duration-200 hover:scale-105 overflow-scroll'>
                <div className="flex flex-row justify-center items-center">
                  <h1 className="text-xl font-bold pt-2 justify-self-center">{filteredProjects[active].title}</h1>
                  {filteredProjects[active].github != '' && <a href={filteredProjects[active].github}><img className="h-7 m-3 hover:scale-125 transition duration-200 justify-self-end" src={'../../../public/images/github-mark-white.png'} alt='github'/></a>}
                </div>
                <h2 className="text-md font-bold self-center italic text-gray-400">{filteredProjects[active].date}</h2>
                <ul className='flex flex-row my-1 self-center'>
                {tags.headers.filter(tag => filteredProjects[active].keywords.includes(tag.name)).map(tag => {
                  return <Tag key={tag.name} color={tag.color} name={tag.name}/>
                })}
                {tags.tools.filter(tag => filteredProjects[active].keywords.includes(tag.name)).map(tag => {
                  return <Tag key={tag.name} color={tag.color} name={tag.name}/>
                })}
                </ul>
                <p className="p-2">{filteredProjects[active].description}</p>
              </div>
            </motion.div>
        </AnimatePresence>
        </div>   

      <button onClick={onClickRight}><img className="invert m-0 -rotate-90 w-auto h-10 hover:scale-150 hover:cursor-pointer transition duration-200" src={'../../images/down.png'} alt={'chevron'}/></button>
    </div>
    </>
  )
}
