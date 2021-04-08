import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';

export class MydemoinfraStack extends cdk.Stack {
  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR repository
    const repository = ecr.Repository.fromRepositoryArn(this, 'mydemo', 'arn:aws:ecr:us-east-1:933673036381:repository/mydemo');

    // Create VPC and Fargate Cluster
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // Instantiate Fargate Service with just cluster and image
    const loadBalancedFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
      },
    });

    // Create CloudFront origin and distribution
    const albOrigin = new origins.LoadBalancerV2Origin(loadBalancedFargateService.loadBalancer,{
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: { 
        origin: albOrigin
      },
      defaultRootObject: 'index.php'
    });

    this.urlOutput = new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName
    });
  }
}
