import { prisma } from "../../src/database.js";
import {faker} from "@faker-js/faker"

function recommendationBody() {
  return {
    name: faker.lorem.words(5),
    youtubeLink: "https://www.youtube.com/watch?v=eGrLJPKh1M8",
    score : faker.datatype.number({min : -5, max :999999})
  };
}

async function insert() {
  const body = recommendationBody();
  const { id } = await prisma.recommendation.create({
    data: {...body, score : 0},
    select: {
      id: true,
    },
  });
  return id;
}

async function insertMany(amount : number) {
  const arrayData = []
  for(let i =0; i < amount; i++){
    arrayData.push(recommendationBody())
  }
  
  
  await prisma.recommendation.createMany({
    data: arrayData,
  });
  return;
}

async function findUniqueById(id : number){
  if (
    !(await prisma.recommendation.findUnique({
      where: { id },
    }))
  )
    return null;
  const {score} = await prisma.recommendation.findUnique({
    where : {id}
  })
  
  return score
}

export default {
  recommendationBody,
  insert,
  insertMany,
  findUniqueById,
};
