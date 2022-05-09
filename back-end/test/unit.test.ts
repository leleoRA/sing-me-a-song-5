import { recommendationService } from '../src/services/recommendationsService.js'
import { recommendationRepository } from '../src/repositories/recommendationRepository.js'
import { jest } from '@jest/globals'
import recommendationFactory from './factories/recommendationFactory.js'
import { conflictError, notFoundError } from '../src/utils/errorUtils.js'

describe('Test recommendationService', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('Test insert function', () => {
    it('should throw error given existing recommendation', () => {
      const body = recommendationFactory.recommendationBody()

      jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue({
        id: 2,
        name: body.name,
        youtubeLink: body.youtubeLink,
        score: body.score,
      })

      return expect(recommendationService.insert(body)).rejects.toEqual(
        conflictError('Recommendations names must be unique')
      )
    })
  })

  describe('Test upvotes and downvotes', () => {
    it('should give error given wrong id', () => {
      const id = 318319123
      jest.spyOn(recommendationRepository, 'find').mockResolvedValue(null)
      return expect(recommendationService.getById(id)).rejects.toEqual(
        notFoundError('')
      )
    })
  })

  describe('Test Randomness', () => {
    it('should give a a music with score lesser than 10', async () => {
      jest
        .spyOn(recommendationService, 'returnMathRandom')
        .mockReturnValue(0.71)
      jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([
        {
          id: 2,
          name: 'fake1',
          youtubeLink: 'fake',
          score: 15,
        },
        {
          id: 1,
          name: 'fake2',
          youtubeLink: 'fake',
          score: -5,
        },
      ])

      const result = await recommendationService.getRandom()
      expect(result.name).toMatch(/fake2/)
    })
  })
})
