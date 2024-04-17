import { Items } from './Items';
import { tick } from 'resources/images';

export function CvTopics({ handleBr, cvTopics, ...props }) {
  return (
    <div className='cvPoint'>
      <h4 className='cvBodyTitle'>{props.headingText}</h4>
      {cvTopics.map((cvTopic, index) => (
        <div key={index} className='cvTechSkillGroup'>
          <img src={tick} alt=' - ' className='cvBullet'/>
          <div className='cvBulletedItem'>
            <h4 className='cvBulletHeading'>{cvTopic.name}</h4>
            <Items handleBr={handleBr} items={cvTopic.itemList} />
          </div>
        </div>
      ))}
    </div>
  )
}
