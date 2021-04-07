import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { MydemoinfraStack} from './mydemoinfra-stack';

/**
 * Deployable unit of web service app
 */
export class MydemoinfraStage extends Stage {
  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new MydemoinfraStack(this, 'MydemoinfraStack');
    
    // Expose CdkpipelinesDemoStack's output one level higher
    this.urlOutput = service.urlOutput;
  }
}
