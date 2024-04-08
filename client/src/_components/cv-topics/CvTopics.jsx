import { CvTopic } from './CvTopic';

export { CvTopics };

function CvTopics({ handleBr, cvTopics, ...props }) {
  return (
    <div className='cvPoint'>
      <h4 className='cvBodyTitle'>{props.headingText}</h4>
      {cvTopics.map((cvTopic, index) => (
        <CvTopic key={index} handleBr={handleBr} cvTopic={cvTopic} />
      ))}
    </div>
  )
}

