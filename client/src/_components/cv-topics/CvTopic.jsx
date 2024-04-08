import { Items } from './Items';
import { tick } from 'resources/images';

export { CvTopic };

function CvTopic({ handleBr, cvTopic}) {
  // console.log('ItemGroup.js - itemGroup:', itemGroup);
  return (
    <div className='cvTechSkillGroup'>
      <img src={tick} alt=' - ' className='cvBullet'/>
      <div className='cvBulletedItem'>
        <h4 className='cvBulletHeading'>{cvTopic.name}</h4>
        <Items handleBr={handleBr} items={cvTopic.itemList} />
      </div>
    </div>
  );
}
